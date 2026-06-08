
// // utils/ai_prompter.js
// function buildCvSystemPrompt() {
//   return [
//     'You are a senior Zambian recruitment consultant and CV writer.',
//     'Generate concise, truthful, recruiter-ready CV content for Zambia.',
//     'Prioritize the target job title, Lusaka/Copperbelt context, local sectors such as mining, agribusiness, logistics, administration, customer service, finance, and technology hubs.',
//     'Convert raw duties into active achievement language without inventing employers, degrees, certifications, dates, or referee details.',
//     'Use the employment-readiness answers to surface soft skills, pressure handling, teamwork, supervision needs, learning agility, projects, school achievements, job achievements, and practical contribution.',
//     'Write for employers who want evidence of reliability, trainability, initiative, collaboration, and fit for the target field.',
//     'Return only valid JSON matching the requested schema.'
//   ].join(' ');
// }

// function buildCvUserPrompt(formData) {
//   return [
//     `Target role: ${formData.targetJobTitle || 'General Professional'}`,
//     'Raw CV record:',
//     JSON.stringify(formData, null, 2),
//     'Create a 3-4 sentence professional summary, 8-12 core competencies, 4-8 workplace strengths, one practical contribution statement, and improved achievement bullets for every work experience item.'
//   ].join('\n');
// }

// function fallbackAiContent(formData) {
//   const target = formData.targetJobTitle || 'Professional';
//   const experience = formData.experience || [];
//   const competencies = [
//     `${target} support`,
//     'Professional communication',
//     'Team collaboration',
//     'Customer service',
//     'Record keeping',
//     'Problem solving',
//     'Time management',
//     'Microsoft Office'
//   ];
//   const attributes = formData.employmentProfile || {};
//   const workplaceStrengths = [
//     ...(attributes.softSkills || []),
//     ...(attributes.personalAttributes || []),
//     'Works well with others',
//     'Learns new tasks quickly'
//   ];

//   return {
//     summary: `${formData.personal?.fullName || 'Candidate'} is a motivated ${target} with practical exposure to Zambian workplace expectations and a strong commitment to reliable service delivery. The profile demonstrates adaptability, professionalism, and readiness to contribute across structured teams in Lusaka, the Copperbelt, and wider local markets. The candidate brings a disciplined approach to communication, administration, learning, and performance-focused responsibilities.`,
//     coreCompetencies: competencies,
//     workplaceStrengths: Array.from(new Set(workplaceStrengths.filter(Boolean))).slice(0, 8),
//     contributionStatement: attributes.realWorldContribution || `Can contribute dependable ${target} support, practical problem solving, and a willingness to learn quickly in a real workplace.`,
//     experienceAchievements: experience.map((item) => ({
//       company: item.company,
//       role: item.role,
//       achievements: splitLines(item.duties).map((duty) => `Delivered ${duty.replace(/\.$/, '')} with consistent attention to quality and deadlines.`)
//     }))
//   };
// }

// function splitLines(value) {
//   return String(value || '')
//     .split(/\r?\n|;/)
//     .map((item) => item.trim())
//     .filter(Boolean);
// }

// module.exports = {
//   buildCvSystemPrompt,
//   buildCvUserPrompt,
//   fallbackAiContent,
//   splitLines
// };


// utils/ai_prompter.js

// ─── System prompt ────────────────────────────────────────────────────────────
// function buildCvSystemPrompt() {
//   return `You are a senior Zambian executive recruitment consultant and CV strategist with 20 years of
// experience placing candidates across Lusaka, the Copperbelt, and Southern African markets.

// CORE MANDATE
// • Produce a polished, recruiter-ready CV that wins interviews at Zambian employers — including
//   mining houses (Mopani, FQM, Barrick), agribusiness firms (Zambeef, Zambia Sugar), NGOs, banks
//   (Zanaco, Standard Chartered, Atlas Mara), logistics operators, government agencies, and tech startups.
// • Every sentence earns its place. Cut filler. Amplify impact.
// • NEVER invent employers, qualifications, certifications, dates, referee details, or salary figures.
// • Convert raw duties into accomplishment language using the CAR formula: Context → Action → Result.
// • Surface soft skills, pressure handling, teamwork style, and workplace values from the employment
//   profile answers — these are differentiators in Zambian hiring decisions.
// • Write for a recruiter scanning a CV in under 30 seconds: strong opening, scannable competencies,
//   clean achievement bullets, one concise contribution statement.

// LANGUAGE & TONE
// • Active verbs, present or past tense matching actual employment status.
// • Professional but human — avoid corporate boilerplate like "results-driven self-starter".
// • Zambian context is a strength: reference local sectors, local regulations, and local networks where
//   genuinely applicable.
// • British English spelling (colour, programme, organised, licence, etc.).

// OUTPUT CONTRACT
// Return ONLY valid JSON. No markdown fences, no commentary, no preamble. Match this exact schema:
// {
//   "summary": "string — 3–4 polished sentences",
//   "coreCompetencies": ["string", ...],          // 8–12 items, 2–5 words each
//   "workplaceStrengths": ["string", ...],        // 4–8 soft-skill phrases
//   "contributionStatement": "string",            // 1 crisp sentence
//   "experienceAchievements": [
//     {
//       "company": "string",
//       "role": "string",
//       "achievements": ["string", ...]           // 3–6 CAR bullets per role
//     }
//   ]
// }`;
// }

// // ─── User prompt ──────────────────────────────────────────────────────────────
// function buildCvUserPrompt(formData) {
//   const ep   = formData.employmentProfile || {};
//   const exp  = formData.experience        || [];
//   const edu  = formData.education         || [];
//   const ach  = formData.achievements      || [];
//   const proj = formData.projects          || [];

//   const contextBlock = [
//     `TARGET ROLE: ${formData.targetJobTitle || 'General Professional'}`,
//     `CANDIDATE: ${formData.personal?.fullName || 'Unknown'}`,
//     formData.personal?.location ? `LOCATION: ${formData.personal.location}` : '',
//     edu.length
//       ? `HIGHEST QUALIFICATION: ${edu[0]?.level || ''} ${edu[0]?.qualification || ''} — ${edu[0]?.institution || ''}`
//       : '',
//     exp.length
//       ? `TOTAL EXPERIENCE ITEMS: ${exp.length} (most recent: ${exp[0]?.role || 'N/A'} at ${exp[0]?.company || 'N/A'})`
//       : 'EXPERIENCE: No prior employment recorded',
//   ].filter(Boolean).join('\n');

//   const profileBlock = [
//     ep.softSkills?.length         ? `Soft skills declared: ${ep.softSkills.join(', ')}` : '',
//     ep.personalAttributes?.length ? `Personal attributes: ${ep.personalAttributes.join(', ')}` : '',
//     ep.pressureHandling           ? `Handles pressure by: ${ep.pressureHandling}` : '',
//     ep.teamworkStyle              ? `Teamwork style: ${ep.teamworkStyle}` : '',
//     ep.supervisionPreference      ? `Supervision preference: ${ep.supervisionPreference}` : '',
//     ep.learningAgility            ? `Learning agility: ${ep.learningAgility}` : '',
//     ep.workplaceValues?.length    ? `Workplace values: ${ep.workplaceValues.join(', ')}` : '',
//     ep.fieldStrengths             ? `Field strengths: ${ep.fieldStrengths}` : '',
//     ep.realWorldContribution      ? `Self-described contribution: ${ep.realWorldContribution}` : '',
//   ].filter(Boolean).join('\n');

//   const achievementsBlock = ach.length
//     ? `NOTABLE ACHIEVEMENTS:\n${ach.map((a) => `• ${a.title || ''}: ${a.context || ''} ${a.result || ''}`.trim()).join('\n')}`
//     : '';

//   const projectsBlock = proj.length
//     ? `PROJECTS & EXPOSURE:\n${proj.map((p) => `• ${p.title || ''}: ${p.contribution || p.context || ''}`.trim()).join('\n')}`
//     : '';

//   return [
//     '=== CANDIDATE CONTEXT ===',
//     contextBlock,
//     '',
//     '=== EMPLOYMENT PROFILE ===',
//     profileBlock || '(No employment profile data provided)',
//     '',
//     achievementsBlock,
//     projectsBlock,
//     '',
//     '=== FULL RAW RECORD ===',
//     JSON.stringify(formData, null, 2),
//     '',
//     '=== YOUR TASK ===',
//     `1. Write a 3–4 sentence professional summary opening with the candidate's name, targeting the role of ${formData.targetJobTitle || 'General Professional'}, and weaving in their strongest proof points from employment history and the profile above.`,
//     '2. Generate 8–12 core competencies (short noun phrases, no verbs) specific to the target role and Zambian market context.',
//     '3. Rewrite every duty/achievement bullet for each experience item using active verbs and CAR language. Produce 3–6 bullets per role. Do not fabricate metrics — use qualitative impact if no numbers are given.',
//     '4. Write one concise contribution statement (one sentence) capturing the unique value this candidate brings to a Zambian employer.',
//     '5. Return ONLY the JSON schema described in the system prompt.',
//   ].filter(Boolean).join('\n');
// }

// // ─── Fallback (no AI available) ───────────────────────────────────────────────
// function fallbackAiContent(formData) {
//   const target  = formData.targetJobTitle || 'Professional';
//   const name    = formData.personal?.fullName || 'The candidate';
//   const ep      = formData.employmentProfile || {};
//   const experience = formData.experience || [];

//   const competencies = [
//     `${target} operations`,
//     'Professional communication',
//     'Stakeholder coordination',
//     'Customer & client service',
//     'Records & data management',
//     'Problem identification & resolution',
//     'Time & priority management',
//     'Microsoft Office Suite',
//     'Team collaboration',
//     'Report writing',
//     'Compliance & quality assurance',
//     'Initiative & self-management',
//   ].slice(0, 10);

//   const softSkills  = ep.softSkills        || [];
//   const attributes  = ep.personalAttributes || [];
//   const combined    = Array.from(new Set([...softSkills, ...attributes, 'Collaborative', 'Dependable']));

//   const summary = [
//     `${name} is a motivated ${target} with a demonstrated commitment to quality, reliability, and professional growth within the Zambian working environment.`,
//     `Drawing on practical exposure to local sector expectations — including structured teamwork, customer-facing responsibilities, and administrative accuracy — ${name.split(' ')[0]} brings a grounded, performance-focused outlook to every assignment.`,
//     `With strong interpersonal skills and a willingness to learn, the candidate is well positioned to contribute meaningfully across teams in Lusaka, the Copperbelt, and wider regional markets.`,
//     ep.realWorldContribution
//       ? ep.realWorldContribution
//       : `A proactive communicator and diligent team member who takes ownership of outcomes and supports organisational goals with consistency.`,
//   ].join(' ');

//   return {
//     summary,
//     coreCompetencies:    competencies,
//     workplaceStrengths:  combined.slice(0, 8),
//     contributionStatement:
//       ep.realWorldContribution ||
//       `Can deliver dependable ${target} support — combining practical problem solving, structured communication, and a rapid learning curve — to add measurable value from day one.`,
//     experienceAchievements: experience.map((item) => ({
//       company:      item.company,
//       role:         item.role,
//       achievements: splitLines(item.duties).map((duty) => {
//         const verb = pickVerb(duty);
//         return `${verb} ${duty.replace(/^(to |the |a |an )/i, '').replace(/\.$/, '')}, maintaining consistent standards of quality and timeliness.`;
//       }),
//     })),
//   };
// }

// // ─── Utility helpers ──────────────────────────────────────────────────────────
// const ACTION_VERBS = [
//   'Delivered', 'Coordinated', 'Managed', 'Supported', 'Processed',
//   'Facilitated', 'Maintained', 'Executed', 'Monitored', 'Resolved',
// ];

// function pickVerb(text) {
//   // If the raw duty already starts with an action verb, keep it capitalised
//   const first = String(text || '').trim().split(/\s+/)[0];
//   if (/^[A-Z][a-z]+ed$|^[A-Z][a-z]+ing$/.test(first)) return '';
//   return ACTION_VERBS[Math.abs(hashStr(text)) % ACTION_VERBS.length];
// }

// function hashStr(s) {
//   let h = 0;
//   for (let i = 0; i < (s || '').length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
//   return h;
// }

// function splitLines(value) {
//   return String(value || '')
//     .split(/\r?\n|[;•]/)
//     .map((s) => s.trim())
//     .filter(Boolean);
// }

// module.exports = {
//   buildCvSystemPrompt,
//   buildCvUserPrompt,
//   fallbackAiContent,
//   splitLines,
// };




// utils/ai_prompter.js

// ─── System prompt ────────────────────────────────────────────────────────────
function buildCvSystemPrompt() {
  return `You are a senior Zambian executive recruitment consultant and CV strategist with 20 years of
experience placing candidates across Lusaka, the Copperbelt, and Southern African markets.

CORE MANDATE
• Produce a polished, recruiter-ready CV that wins interviews at Zambian employers — including
  mining houses (Mopani, FQM, Barrick), agribusiness firms (Zambeef, Zambia Sugar), NGOs, banks
  (Zanaco, Standard Chartered, Atlas Mara), logistics operators, government agencies, and tech startups.
• Every sentence earns its place. Cut filler. Amplify impact.
• NEVER invent employers, qualifications, certifications, dates, referee details, or salary figures.
• Convert raw duties into accomplishment language using the CAR formula: Context → Action → Result.
• Surface soft skills, pressure handling, teamwork style, and workplace values from the employment
  profile answers — these are differentiators in Zambian hiring decisions.
• Write for a recruiter scanning a CV in under 30 seconds: strong opening, scannable competencies,
  clean achievement bullets, one concise contribution statement.

LANGUAGE & TONE
• Active verbs, present or past tense matching actual employment status.
• Professional but human — avoid corporate boilerplate like "results-driven self-starter".
• Zambian context is a strength: reference local sectors, local regulations, and local networks where
  genuinely applicable.
• British English spelling (colour, programme, organised, licence, etc.).
• Silently correct every spelling, grammar, and punctuation error found in the candidate's raw input when incorporating it into any output field. Never preserve a misspelling from the source data — just fix it and move on without commenting.

OUTPUT CONTRACT
Return ONLY valid JSON. No markdown fences, no commentary, no preamble. Match this exact schema:
{
  "summary": "string — 3–4 polished sentences",
  "coreCompetencies": ["string", ...],          // 8–12 items, 2–5 words each
  "workplaceStrengths": ["string", ...],        // 4–8 soft-skill phrases
  "contributionStatement": "string",            // 1 crisp sentence
  "experienceAchievements": [
    {
      "company": "string",
      "role": "string",
      "achievements": ["string", ...]           // 3–6 CAR bullets per role
    }
  ]
}`;
}

// ─── User prompt ──────────────────────────────────────────────────────────────
function buildCvUserPrompt(formData) {
  const ep   = formData.employmentProfile || {};
  const exp  = formData.experience        || [];
  const edu  = formData.education         || [];
  const ach  = formData.achievements      || [];
  const proj = formData.projects          || [];

  const contextBlock = [
    `TARGET ROLE: ${formData.targetJobTitle || 'General Professional'}`,
    `CANDIDATE: ${formData.personal?.fullName || 'Unknown'}`,
    formData.personal?.location ? `LOCATION: ${formData.personal.location}` : '',
    edu.length
      ? `HIGHEST QUALIFICATION: ${edu[0]?.level || ''} ${edu[0]?.qualification || ''} — ${edu[0]?.institution || ''}`
      : '',
    exp.length
      ? `TOTAL EXPERIENCE ITEMS: ${exp.length} (most recent: ${exp[0]?.role || 'N/A'} at ${exp[0]?.company || 'N/A'})`
      : 'EXPERIENCE: No prior employment recorded',
  ].filter(Boolean).join('\n');

  const profileBlock = [
    ep.softSkills?.length         ? `Soft skills declared: ${ep.softSkills.join(', ')}` : '',
    ep.personalAttributes?.length ? `Personal attributes: ${ep.personalAttributes.join(', ')}` : '',
    ep.pressureHandling           ? `Handles pressure by: ${ep.pressureHandling}` : '',
    ep.teamworkStyle              ? `Teamwork style: ${ep.teamworkStyle}` : '',
    ep.supervisionPreference      ? `Supervision preference: ${ep.supervisionPreference}` : '',
    ep.learningAgility            ? `Learning agility: ${ep.learningAgility}` : '',
    ep.workplaceValues?.length    ? `Workplace values: ${ep.workplaceValues.join(', ')}` : '',
    ep.fieldStrengths             ? `Field strengths: ${ep.fieldStrengths}` : '',
    ep.realWorldContribution      ? `Self-described contribution: ${ep.realWorldContribution}` : '',
  ].filter(Boolean).join('\n');

  const achievementsBlock = ach.length
    ? `NOTABLE ACHIEVEMENTS:\n${ach.map((a) => `• ${a.title || ''}: ${a.context || ''} ${a.result || ''}`.trim()).join('\n')}`
    : '';

  const projectsBlock = proj.length
    ? `PROJECTS & EXPOSURE:\n${proj.map((p) => `• ${p.title || ''}: ${p.contribution || p.context || ''}`.trim()).join('\n')}`
    : '';

  return [
    '=== CANDIDATE CONTEXT ===',
    contextBlock,
    '',
    '=== EMPLOYMENT PROFILE ===',
    profileBlock || '(No employment profile data provided)',
    '',
    achievementsBlock,
    projectsBlock,
    '',
    '=== FULL RAW RECORD ===',
    JSON.stringify(formData, null, 2),
    '',
    '=== YOUR TASK ===',
    `1. Write a 3–4 sentence professional summary opening with the candidate's name, targeting the role of ${formData.targetJobTitle || 'General Professional'}, and weaving in their strongest proof points from employment history and the profile above.`,
    '2. Generate 8–12 core competencies (short noun phrases, no verbs) specific to the target role and Zambian market context.',
    '3. Rewrite every duty/achievement bullet for each experience item using active verbs and CAR language. Produce 3–6 bullets per role. Do not fabricate metrics — use qualitative impact if no numbers are given.',
    '4. Write one concise contribution statement (one sentence) capturing the unique value this candidate brings to a Zambian employer.',
    '5. Silently fix every spelling, grammar, and punctuation error from the raw input as you write. Do not flag, annotate, or comment on any correction — just produce clean, error-free British English text throughout all fields.',
    '6. Return ONLY the JSON schema described in the system prompt.',
  ].filter(Boolean).join('\n');
}

// ─── Fallback (no AI available) ───────────────────────────────────────────────
function fallbackAiContent(formData) {
  const target  = formData.targetJobTitle || 'Professional';
  const name    = formData.personal?.fullName || 'The candidate';
  const ep      = formData.employmentProfile || {};
  const experience = formData.experience || [];

  const competencies = [
    `${target} operations`,
    'Professional communication',
    'Stakeholder coordination',
    'Customer & client service',
    'Records & data management',
    'Problem identification & resolution',
    'Time & priority management',
    'Microsoft Office Suite',
    'Team collaboration',
    'Report writing',
    'Compliance & quality assurance',
    'Initiative & self-management',
  ].slice(0, 10);

  const softSkills  = ep.softSkills        || [];
  const attributes  = ep.personalAttributes || [];
  const combined    = Array.from(new Set([...softSkills, ...attributes, 'Collaborative', 'Dependable']));

  const summary = [
    `${name} is a motivated ${target} with a demonstrated commitment to quality, reliability, and professional growth within the Zambian working environment.`,
    `Drawing on practical exposure to local sector expectations — including structured teamwork, customer-facing responsibilities, and administrative accuracy — ${name.split(' ')[0]} brings a grounded, performance-focused outlook to every assignment.`,
    `With strong interpersonal skills and a willingness to learn, the candidate is well positioned to contribute meaningfully across teams in Lusaka, the Copperbelt, and wider regional markets.`,
    ep.realWorldContribution
      ? ep.realWorldContribution
      : `A proactive communicator and diligent team member who takes ownership of outcomes and supports organisational goals with consistency.`,
  ].join(' ');

  return {
    summary,
    coreCompetencies:    competencies,
    workplaceStrengths:  combined.slice(0, 8),
    contributionStatement:
      ep.realWorldContribution ||
      `Can deliver dependable ${target} support — combining practical problem solving, structured communication, and a rapid learning curve — to add measurable value from day one.`,
    experienceAchievements: experience.map((item) => ({
      company:      item.company,
      role:         item.role,
      achievements: splitLines(item.duties).map((duty) => {
        const verb = pickVerb(duty);
        return `${verb} ${duty.replace(/^(to |the |a |an )/i, '').replace(/\.$/, '')}, maintaining consistent standards of quality and timeliness.`;
      }),
    })),
  };
}

// ─── Utility helpers ──────────────────────────────────────────────────────────
const ACTION_VERBS = [
  'Delivered', 'Coordinated', 'Managed', 'Supported', 'Processed',
  'Facilitated', 'Maintained', 'Executed', 'Monitored', 'Resolved',
];

function pickVerb(text) {
  // If the raw duty already starts with an action verb, keep it capitalised
  const first = String(text || '').trim().split(/\s+/)[0];
  if (/^[A-Z][a-z]+ed$|^[A-Z][a-z]+ing$/.test(first)) return '';
  return ACTION_VERBS[Math.abs(hashStr(text)) % ACTION_VERBS.length];
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < (s || '').length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

function splitLines(value) {
  return String(value || '')
    .split(/\r?\n|[;•]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

module.exports = {
  buildCvSystemPrompt,
  buildCvUserPrompt,
  fallbackAiContent,
  splitLines,
};