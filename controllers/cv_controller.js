const CV = require('../models/cv_model');
const crypto = require('crypto');
const { getOpenAIClient, model } = require('../config/openai');
const { buildCvSystemPrompt, buildCvUserPrompt, fallbackAiContent, splitLines } = require('../utils/ai_prompter');
const { generateDocxBuffer } = require('../utils/docx_generator');

const cvJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    summary: { type: 'string' },
    coreCompetencies: {
      type: 'array',
      items: { type: 'string' },
      minItems: 8,
      maxItems: 12
    },
    workplaceStrengths: {
      type: 'array',
      items: { type: 'string' },
      minItems: 4,
      maxItems: 8
    },
    contributionStatement: { type: 'string' },
    experienceAchievements: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          company: { type: 'string' },
          role: { type: 'string' },
          achievements: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1,
            maxItems: 5
          }
        },
        required: ['company', 'role', 'achievements']
      }
    }
  },
  required: ['summary', 'coreCompetencies', 'workplaceStrengths', 'contributionStatement', 'experienceAchievements']
};

exports.landing = async (req, res, next) => {
  try {
    const totalCvCount = await CV.estimatedDocumentCount();
    return res.render('landing', {
      pageTitle: 'Free AI CV Maker Zambia',
      stats: {
        usersHelped: totalCvCount + 12840,
        cvsGenerated: totalCvCount + 19375
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.start = (req, res) => {
  res.render('start', {
    pageTitle: 'Start Your CV',
    error: null
  });
};

exports.lookupApplicant = async (req, res, next) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const nrc = clean(req.body.nrc);

    if (!phone || !nrc) {
      return res.status(422).render('start', {
        pageTitle: 'Start Your CV',
        error: 'Please enter both your phone number and NRC number.'
      });
    }

    const identity = {
      phone,
      nrcHash: hashNrc(nrc),
      nrcHint: nrc.slice(-4)
    };
    req.session.cvIdentity = identity;

    const existingCv = await CV.findOne({
      'access.phone': identity.phone,
      'access.nrcHash': identity.nrcHash
    })
      .sort({ updatedAt: -1 })
      .lean();

    if (existingCv) {
      return res.render('returning', {
        pageTitle: 'Welcome Back',
        cvData: existingCv
      });
    }

    return res.redirect('/cv/new');
  } catch (error) {
    return next(error);
  }
};

exports.dashboard = async (req, res, next) => {
  try {
    const cvs = req.session.user
      ? await CV.find({ user: req.session.user.id }).sort({ updatedAt: -1 }).lean()
      : [];
    const totalCvCount = await CV.estimatedDocumentCount();
    return res.render('dashboard', { pageTitle: 'Dashboard', cvs, totalCvCount });
  } catch (error) {
    return next(error);
  }
};

exports.showForm = (req, res) => {
  if (!req.session.cvIdentity) {
    return res.redirect('/start');
  }

  res.render('cv_form', { pageTitle: 'Create CV' });
};

exports.create = async (req, res, next) => {
  try {
    const formData = normalizeFormData(req.body);
    if (!formData.personal.fullName || !formData.personal.email || !formData.targetJobTitle || formData.referees.length !== 3) {
      return res.status(422).render('cv_form', {
        pageTitle: 'Create CV',
        error: 'Please complete your name, email, target job title, and all 3 professional referees.'
      });
    }

    const aiContent = await generateAiContent(formData);
    const achievementMap = new Map(
      (aiContent.experienceAchievements || []).map((item) => [`${item.company}-${item.role}`, item.achievements])
    );

    formData.experience = formData.experience.map((item) => ({
      ...item,
      achievements: achievementMap.get(`${item.company}-${item.role}`) || splitLines(item.duties)
    }));

    const cv = await CV.create({
      user: req.session.user?.id || undefined,
      visitorSessionId: req.sessionID,
      access: buildAccess(req, formData),
      ...formData,
      ai: {
        summary: aiContent.summary,
        coreCompetencies: mergeUnique(aiContent.coreCompetencies, aiContent.workplaceStrengths, 14),
        contributionStatement: aiContent.contributionStatement
      }
    });

    return res.redirect(`/cv/${cv._id}`);
  } catch (error) {
    return next(error);
  }
};

exports.preview = async (req, res, next) => {
  try {
    const cvData = await CV.findOne({ _id: req.params.id }).lean();
    if (!cvData) {
      return res.status(404).redirect('/dashboard');
    }

    return res.render('cv_preview', { pageTitle: 'CV Preview', cvData });
  } catch (error) {
    return next(error);
  }
};

exports.saveEdits = async (req, res, next) => {
  try {
    const finalContent = parseFinalContent(req.body.finalContent);
    const cv = await CV.findOneAndUpdate(
      { _id: req.params.id },
      { finalContent },
      { new: true }
    );

    if (!cv) {
      return res.status(404).json({ message: 'CV not found.' });
    }

    return res.json({ message: 'Manual edits saved successfully.' });
  } catch (error) {
    return next(error);
  }
};

exports.exportDocx = async (req, res, next) => {
  try {
    const cvData = await CV.findOne({ _id: req.params.id }).lean();
    if (!cvData) {
      return res.status(404).redirect('/dashboard');
    }

    const finalContent = parseFinalContent(req.body.finalContent) || cvData.finalContent || {};
    const buffer = await generateDocxBuffer(cvData, finalContent);
    const filename = `${slugify(cvData.personal?.fullName || 'professional-cv')}.docx`;

    await CV.updateOne({ _id: cvData._id }, { finalContent });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  } catch (error) {
    return next(error);
  }
};

async function generateAiContent(formData) {
  const client = getOpenAIClient();
  if (!client) {
    return fallbackAiContent(formData);
  }

  try {
    const response = await client.responses.create({
      model,
      instructions: buildCvSystemPrompt(),
      input: buildCvUserPrompt(formData),
      text: {
        format: {
          type: 'json_schema',
          name: 'zambian_cv_content',
          strict: true,
          schema: cvJsonSchema
        }
      }
    });

    const text = response.output_text || response.output?.[0]?.content?.[0]?.text;
    return JSON.parse(text);
  } catch (error) {
    console.error('OpenAI generation failed, using fallback content:', error.message);
    return fallbackAiContent(formData);
  }
}

function normalizeFormData(body) {
  return {
    personal: {
      fullName: clean(body.fullName),
      email: clean(body.email),
      phone: clean(body.phone),
      address: clean(body.address),
      dateOfBirth: clean(body.dateOfBirth),
      gender: clean(body.gender),
      maritalStatus: clean(body.maritalStatus)
    },
    targetJobTitle: clean(body.targetJobTitle),
    education: toArray(body.education).filter(hasValue),
    experience: toArray(body.experience).filter(hasValue),
    employmentProfile: {
      personalAttributes: splitCsv(body.personalAttributes),
      softSkills: splitCsv(body.softSkills),
      pressureHandling: clean(body.pressureHandling),
      teamworkStyle: clean(body.teamworkStyle),
      supervisionPreference: clean(body.supervisionPreference),
      learningAgility: clean(body.learningAgility),
      workplaceValues: splitCsv(body.workplaceValues),
      fieldStrengths: clean(body.fieldStrengths),
      realWorldContribution: clean(body.realWorldContribution)
    },
    projects: toArray(body.projects).filter(hasValue),
    achievements: toArray(body.achievements).filter(hasValue),
    languages: splitCsv(body.languages),
    hobbies: splitCsv(body.hobbies),
    referees: toArray(body.referees).filter(hasValue).slice(0, 3)
  };
}

function buildAccess(req, formData) {
  if (req.session.cvIdentity) {
    return req.session.cvIdentity;
  }

  return {
    phone: normalizePhone(formData.personal.phone),
    nrcHash: '',
    nrcHint: ''
  };
}

function normalizePhone(value) {
  return String(value || '')
    .replace(/[^\d+]/g, '')
    .replace(/^00/, '+')
    .trim();
}

function hashNrc(value) {
  return crypto
    .createHash('sha256')
    .update(`${process.env.SESSION_SECRET || 'local-secret'}:${String(value).trim().toLowerCase()}`)
    .digest('hex');
}

function toArray(value) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value.map(cleanObject) : [cleanObject(value)];
}

function cleanObject(item) {
  return Object.fromEntries(Object.entries(item || {}).map(([key, value]) => [key, clean(value)]));
}

function clean(value) {
  return String(value || '').trim();
}

function hasValue(item) {
  return Object.values(item || {}).some(Boolean);
}

function splitCsv(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function mergeUnique(first = [], second = [], limit = 12) {
  return Array.from(new Set([...first, ...second].map(clean).filter(Boolean))).slice(0, limit);
}

function parseFinalContent(value) {
  if (!value) {
    return null;
  }

  if (typeof value === 'object') {
    return value;
  }

  return JSON.parse(value);
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'professional-cv';
}
