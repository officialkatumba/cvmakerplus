

// utils/docx_generator.js
// const {
//   AlignmentType,
//   BorderStyle,
//   Document,
//   HeadingLevel,
//   Packer,
//   Paragraph,
//   SectionType,
//   ShadingType,
//   Table,
//   TableCell,
//   TableRow,
//   TextRun,
//   WidthType
// } = require('docx');

// const empty = (value) => String(value || '').trim();
// const subtleBorders = {
//   top: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
//   bottom: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
//   left: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
//   right: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' }
// };

// function textRun(text, options = {}) {
//   return new TextRun({
//     text: empty(text),
//     font: 'Aptos',
//     size: options.size || 22,
//     bold: options.bold || false,
//     color: options.color || '1f2937',
//     allCaps: options.allCaps || false,
//     break: options.break || 0
//   });
// }

// function sectionTitle(title) {
//   return new Paragraph({
//     heading: HeadingLevel.HEADING_2,
//     spacing: { before: 280, after: 140 },
//     shading: { fill: 'f8fafc', type: ShadingType.CLEAR },
//     border: {
//       left: { style: BorderStyle.SINGLE, size: 20, color: '0d9488', space: 8 },
//       bottom: { style: BorderStyle.SINGLE, size: 4, color: 'e2e8f0' }
//     },
//     children: [textRun(title, { bold: true, color: '1e3a8a', size: 26, allCaps: true })]
//   });
// }

// function row(label, value) {
//   if (!empty(value)) {
//     return [label, value];
//   }

//   return null;
// }

// function infoTable(rows) {
//   const cleanRows = rows.filter(Boolean);
//   if (!cleanRows.length) {
//     return null;
//   }

//   return new Table({
//     width: { size: 100, type: WidthType.PERCENTAGE },
//     rows: cleanRows.map(
//       ([label, value]) =>
//         new TableRow({
//           children: [
//             new TableCell({
//               width: { size: 28, type: WidthType.PERCENTAGE },
//               shading: { fill: 'f8fafc', type: ShadingType.CLEAR },
//               borders: subtleBorders,
//               margins: { top: 90, bottom: 90, left: 120, right: 120 },
//               children: [paragraph(label, { bold: true, color: '1e3a8a', after: 0 })]
//             }),
//             new TableCell({
//               width: { size: 72, type: WidthType.PERCENTAGE },
//               borders: subtleBorders,
//               margins: { top: 90, bottom: 90, left: 120, right: 120 },
//               children: [paragraph(value, { after: 0 })]
//             })
//           ]
//         })
//     )
//   });
// }

// function paragraph(text, options = {}) {
//   return new Paragraph({
//     spacing: { after: options.after || 100 },
//     bullet: options.bullet ? { level: 0 } : undefined,
//     children: [textRun(text, options)]
//   });
// }

// function generateDocxBuffer(cvData, finalContent = {}) {
//   const personal = finalContent.personal || cvData.personal || {};
//   const targetJobTitle = finalContent.targetJobTitle || cvData.targetJobTitle || '';
//   const summary = finalContent.summary || cvData.ai?.summary || '';
//   const contributionStatement = finalContent.contributionStatement || cvData.ai?.contributionStatement || cvData.employmentProfile?.realWorldContribution || '';
//   const competencies = finalContent.coreCompetencies || cvData.ai?.coreCompetencies || [];
//   const experience = finalContent.experience || cvData.experience || [];
//   const education = finalContent.education || cvData.education || [];
//   const employmentProfile = finalContent.employmentProfile || cvData.employmentProfile || {};
//   const achievements = finalContent.achievements || cvData.achievements || [];
//   const projects = finalContent.projects || cvData.projects || [];
//   const referees = finalContent.referees || cvData.referees || [];
//   const languages = finalContent.languages || cvData.languages || [];
//   const hobbies = finalContent.hobbies || cvData.hobbies || [];

//   const children = [
//     new Paragraph({
//       alignment: AlignmentType.LEFT,
//       spacing: { after: 70 },
//       shading: { fill: 'eff6ff', type: ShadingType.CLEAR },
//       children: [textRun(personal.fullName || 'Professional CV', { bold: true, color: '1e3a8a', size: 46 })]
//     }),
//     new Paragraph({
//       alignment: AlignmentType.LEFT,
//       spacing: { after: 130 },
//       children: [textRun(targetJobTitle, { bold: true, color: '0d9488', size: 24, allCaps: true })]
//     }),
//     new Paragraph({
//       alignment: AlignmentType.CENTER,
//       spacing: { after: 240 },
//       children: [
//         textRun([personal.email, personal.phone, personal.address].filter(Boolean).join(' | '), { size: 20 })
//       ]
//     }),
//     sectionTitle('Professional Summary'),
//     paragraph(summary)
//   ];

//   if (experience.length) {
//     children.push(sectionTitle('Professional Experience'));
//     experience.forEach((item) => {
//       children.push(
//         paragraph(item.role || 'Role', { bold: true, after: 20 }),
//         paragraph([item.company, item.location, [item.startDate, item.endDate].filter(Boolean).join(' - ')].filter(Boolean).join(' | '), {
//           color: '0d9488',
//           bold: true
//         })
//       );
//       (item.achievements || []).forEach((achievement) => children.push(paragraph(achievement, { bullet: true })));
//     });
//   }

//   if (education.length) {
//     children.push(sectionTitle('Education Background'));
//     education.forEach((item) => {
//       children.push(
//         paragraph(`${item.level || ''}: ${item.qualification || ''}`, { bold: true, after: 20 }),
//         paragraph([item.institution, item.location, [item.startDate, item.endDate].filter(Boolean).join(' - ')].filter(Boolean).join(' | '))
//       );
//       if (item.details) {
//         children.push(paragraph(item.details));
//       }
//     });
//   }

//   if (competencies.length) {
//     children.push(sectionTitle('Core Competencies'));
//     const table = infoTable(competencies.filter(Boolean).map((skill, index) => [`Skill ${index + 1}`, skill]));
//     if (table) children.push(table);
//   }

//   const readinessTable = infoTable([
//     row('Personal Attributes', (employmentProfile.personalAttributes || []).join(', ')),
//     row('Soft Skills', (employmentProfile.softSkills || []).join(', ')),
//     row('Under Pressure', employmentProfile.pressureHandling),
//     row('Teamwork', employmentProfile.teamworkStyle),
//     row('Supervision', employmentProfile.supervisionPreference),
//     row('Learning Speed', employmentProfile.learningAgility),
//     row('Workplace Values', (employmentProfile.workplaceValues || []).join(', ')),
//     row('Field Fit', employmentProfile.fieldStrengths),
//     row('Contribution', contributionStatement)
//   ]);

//   if (readinessTable) {
//     children.push(sectionTitle('Employment Readiness'));
//     children.push(readinessTable);
//   }

//   if (achievements.length) {
//     children.push(sectionTitle('Achievements Relevant To This Role'));
//     const table = infoTable(
//       achievements.map((item) => [
//         item.title || 'Achievement',
//         [item.context, item.result, item.relevance].filter(Boolean).join(' | ')
//       ])
//     );
//     if (table) children.push(table);
//   }

//   if (projects.length) {
//     children.push(sectionTitle('Projects & Practical Exposure'));
//     const table = infoTable(
//       projects.map((item) => [
//         item.title || 'Project',
//         [item.context, item.role, item.contribution, item.outcome || item.tools].filter(Boolean).join(' | ')
//       ])
//     );
//     if (table) children.push(table);
//   }

//   if (languages.length) {
//     children.push(sectionTitle('Languages'));
//     children.push(paragraph(languages.filter(Boolean).join(', ')));
//   }

//   if (hobbies.length) {
//     children.push(sectionTitle('Hobbies & Interests'));
//     children.push(paragraph(hobbies.filter(Boolean).join(', ')));
//   }

//   if (referees.length) {
//     children.push(sectionTitle('Professional Referees'));
//     const rows = referees.map(
//       (referee) =>
//         new TableRow({
//           children: [
//             new TableCell({
//               width: { size: 33, type: WidthType.PERCENTAGE },
//               shading: { fill: 'f8fafc', type: ShadingType.CLEAR },
//               children: [paragraph(referee.fullName, { bold: true }), paragraph(referee.designation)]
//             }),
//             new TableCell({
//               width: { size: 33, type: WidthType.PERCENTAGE },
//               children: [paragraph(referee.company)]
//             }),
//             new TableCell({
//               width: { size: 34, type: WidthType.PERCENTAGE },
//               children: [paragraph(referee.phone), paragraph(referee.email)]
//             })
//           ]
//         })
//     );
//     children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));
//   }

//   const doc = new Document({
//     styles: {
//       default: {
//         document: {
//           run: { font: 'Aptos', size: 22 }
//         }
//       }
//     },
//     sections: [
//       {
//         properties: {
//           type: SectionType.CONTINUOUS,
//           page: {
//             size: { width: 11906, height: 16838 },
//             margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 }
//           }
//         },
//         children
//       }
//     ]
//   });

//   return Packer.toBuffer(doc);
// }

// module.exports = {
//   generateDocxBuffer
// };


// utils/docx_generator.js
const {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  SectionType,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  VerticalAlign,
  PageNumber,
  Footer,
  PageBreak
} = require('docx');

// ─── Palette ─────────────────────────────────────────────────────────────────
const BRAND = {
  navy:       '0F2D5E',   // deep navy – name, headings
  teal:       '0C7C7B',   // teal – accent bar, role, dividers
  tealLight:  'E6F4F4',   // teal wash – header bg
  slate:      '374151',   // body text
  muted:      '6B7280',   // metadata / dates
  rule:       'CBD5E1',   // subtle horizontal lines
  rowAlt:     'F8FAFC',   // alternating table row
  white:      'FFFFFF',
};

// A4 content width with 18mm margins (1020 DXA each side) → 9866 DXA
const PAGE_W    = 11906;
const PAGE_H    = 16838;
const MARGIN    = 1020;
const CONTENT_W = PAGE_W - MARGIN * 2; // 9866

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const empty = (v) => String(v || '').trim();

function run(text, opts = {}) {
  return new TextRun({
    text:      empty(text),
    font:      opts.font  || 'Calibri',
    size:      opts.size  || 22,
    bold:      opts.bold  || false,
    italics:   opts.italic || false,
    color:     opts.color || BRAND.slate,
    allCaps:   opts.caps  || false,
    smallCaps: opts.small || false,
    break:     opts.break || 0,
  });
}

function para(text, opts = {}) {
  const runs = Array.isArray(text)
    ? text
    : [run(text, opts)];
  return new Paragraph({
    alignment:  opts.align || AlignmentType.LEFT,
    spacing:    { before: opts.before || 0, after: opts.after !== undefined ? opts.after : 80, line: opts.line || 276 },
    numbering:  opts.numbering || undefined,
    indent:     opts.indent || undefined,
    border:     opts.border || undefined,
    shading:    opts.shading || undefined,
    children:   runs,
  });
}

// ─── Section heading with bold left-bar + full-width underrule ───────────────
function sectionHeading(title) {
  return new Paragraph({
    spacing: { before: 320, after: 100 },
    border: {
      left:   { style: BorderStyle.SINGLE, size: 24, color: BRAND.teal, space: 8 },
      bottom: { style: BorderStyle.SINGLE, size:  4, color: BRAND.rule },
    },
    children: [
      run(title, { bold: true, caps: true, color: BRAND.navy, size: 24, font: 'Calibri' }),
    ],
  });
}

// ─── Thin horizontal rule ─────────────────────────────────────────────────────
function hairline() {
  return new Paragraph({
    spacing: { before: 0, after: 0 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: BRAND.rule } },
    children: [],
  });
}

// ─── Two-column info table (label | value) ────────────────────────────────────
function infoTable(rows) {
  const clean = rows.filter(Boolean);
  if (!clean.length) return null;

  const border = (color = BRAND.rule) => ({ style: BorderStyle.SINGLE, size: 1, color });
  const borders = { top: border(), bottom: border(), left: border(), right: border() };
  const COL1 = Math.round(CONTENT_W * 0.28);
  const COL2 = CONTENT_W - COL1;

  return new Table({
    width:        { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [COL1, COL2],
    rows: clean.map(([label, value], i) =>
      new TableRow({
        children: [
          new TableCell({
            width:   { size: COL1, type: WidthType.DXA },
            borders,
            shading: { fill: BRAND.rowAlt, type: ShadingType.CLEAR },
            margins: { top: 90, bottom: 90, left: 130, right: 130 },
            verticalAlign: VerticalAlign.TOP,
            children: [para(label, { bold: true, color: BRAND.navy, size: 20, after: 0 })],
          }),
          new TableCell({
            width:   { size: COL2, type: WidthType.DXA },
            borders,
            shading: { fill: i % 2 === 0 ? BRAND.white : BRAND.rowAlt, type: ShadingType.CLEAR },
            margins: { top: 90, bottom: 90, left: 130, right: 130 },
            verticalAlign: VerticalAlign.TOP,
            children: [para(value, { color: BRAND.slate, size: 20, after: 0 })],
          }),
        ],
      })
    ),
  });
}

// ─── Skill pills – three-column compact table ─────────────────────────────────
function skillsTable(skills) {
  if (!skills.length) return null;

  const border  = { style: BorderStyle.NONE, size: 0, color: BRAND.white };
  const borders = { top: border, bottom: border, left: border, right: border };
  const COL     = Math.round(CONTENT_W / 3);

  const chunked = [];
  for (let i = 0; i < skills.length; i += 3) chunked.push(skills.slice(i, i + 3));

  return new Table({
    width:        { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [COL, COL, COL],
    rows: chunked.map(
      (trio) =>
        new TableRow({
          children: [0, 1, 2].map((idx) => {
            const skill = trio[idx] || '';
            return new TableCell({
              width:   { size: COL, type: WidthType.DXA },
              borders,
              shading: { fill: BRAND.tealLight, type: ShadingType.CLEAR },
              margins: { top: 70, bottom: 70, left: 140, right: 140 },
              children: skill
                ? [para(skill, { color: BRAND.navy, size: 20, bold: true, after: 0 })]
                : [para('', { after: 0 })],
            });
          }),
        })
    ),
  });
}

// ─── Header band (name + contact strip) ───────────────────────────────────────
function buildHeader(personal, targetJobTitle) {
  const contactParts = [personal.email, personal.phone, personal.location || personal.address]
    .filter(Boolean);

  return [
    // Teal wash behind name block via shading on a borderless paragraph
    new Paragraph({
      spacing:  { before: 0, after: 40 },
      shading:  { fill: BRAND.tealLight, type: ShadingType.CLEAR },
      border: {
        left: { style: BorderStyle.SINGLE, size: 48, color: BRAND.teal, space: 10 },
      },
      children: [
        run(personal.fullName || 'Professional CV', {
          bold: true, color: BRAND.navy, size: 56, font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 40 },
      shading: { fill: BRAND.tealLight, type: ShadingType.CLEAR },
      border: {
        left:   { style: BorderStyle.SINGLE, size: 48, color: BRAND.teal, space: 10 },
        bottom: { style: BorderStyle.SINGLE, size:  4, color: BRAND.teal },
      },
      children: [
        run(targetJobTitle, { bold: true, caps: true, color: BRAND.teal, size: 24 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing:   { before: 100, after: 220 },
      children:  [run(contactParts.join('   ·   '), { color: BRAND.muted, size: 19 })],
    }),
  ];
}

// ─── Experience block ─────────────────────────────────────────────────────────
function buildExperience(experience, numbering) {
  const blocks = [sectionHeading('Professional Experience')];

  experience.forEach((item, idx) => {
    if (idx > 0) blocks.push(hairline());

    const dateRange = [item.startDate, item.endDate].filter(Boolean).join(' – ');
    const meta      = [item.company, item.location, dateRange].filter(Boolean);

    blocks.push(
      para(item.role || 'Role', { bold: true, color: BRAND.navy, size: 23, after: 20 }),
      para(meta.join('   |   '), { color: BRAND.teal, size: 20, italic: true, after: 60 }),
    );

    (item.achievements || []).forEach((ach) => {
      blocks.push(
        new Paragraph({
          spacing:  { before: 0, after: 60 },
          numbering: { reference: 'bullets', level: 0 },
          children: [run(ach, { color: BRAND.slate, size: 21 })],
        })
      );
    });
  });

  return blocks;
}

// ─── Main generator ───────────────────────────────────────────────────────────
function generateDocxBuffer(cvData, finalContent = {}) {
  const personal       = finalContent.personal       || cvData.personal       || {};
  const targetJobTitle = finalContent.targetJobTitle || cvData.targetJobTitle || '';
  const summary        = finalContent.summary        || cvData.ai?.summary    || '';
  const contribution   = finalContent.contributionStatement
                       || cvData.ai?.contributionStatement
                       || cvData.employmentProfile?.realWorldContribution
                       || '';
  const competencies   = finalContent.coreCompetencies || cvData.ai?.coreCompetencies || [];
  const experience     = finalContent.experience     || cvData.experience     || [];
  const education      = finalContent.education      || cvData.education      || [];
  const employmentProfile = finalContent.employmentProfile || cvData.employmentProfile || {};
  const achievements   = finalContent.achievements   || cvData.achievements   || [];
  const projects       = finalContent.projects       || cvData.projects       || [];
  const referees       = finalContent.referees       || cvData.referees       || [];
  const languages      = finalContent.languages      || cvData.languages      || [];
  const hobbies        = finalContent.hobbies        || cvData.hobbies        || [];

  const children = [];

  // ── Header ─────────────────────────────────────────────────────────────────
  children.push(...buildHeader(personal, targetJobTitle));

  // ── Professional Summary ───────────────────────────────────────────────────
  children.push(
    sectionHeading('Professional Summary'),
    para(summary, { color: BRAND.slate, size: 21, line: 310, after: 100 }),
  );

  // ── Professional Experience ───────────────────────────────────────────────
  if (experience.length) {
    children.push(...buildExperience(experience, 'bullets'));
  }

  // ── Education ─────────────────────────────────────────────────────────────
  if (education.length) {
    children.push(sectionHeading('Education'));

    education.forEach((item, idx) => {
      if (idx > 0) children.push(hairline());

      const qual      = [item.level, item.qualification].filter(Boolean).join(': ');
      const dateRange = [item.startDate, item.endDate].filter(Boolean).join(' – ');
      const meta      = [item.institution, item.location, dateRange].filter(Boolean);

      children.push(
        para(qual, { bold: true, color: BRAND.navy, size: 22, after: 20 }),
        para(meta.join('   |   '), { color: BRAND.teal, size: 20, italic: true }),
      );
      if (item.details) children.push(para(item.details, { size: 20, color: BRAND.muted }));
    });
  }

  // ── Core Competencies ─────────────────────────────────────────────────────
  if (competencies.length) {
    children.push(sectionHeading('Core Competencies'));
    const tbl = skillsTable(competencies.filter(Boolean));
    if (tbl) children.push(tbl);
    children.push(para('', { after: 60 }));
  }

  // ── Employment Readiness ──────────────────────────────────────────────────
  const readinessRows = [
    employmentProfile.personalAttributes?.length
      ? ['Personal Attributes', (employmentProfile.personalAttributes || []).join(', ')]
      : null,
    employmentProfile.softSkills?.length
      ? ['Soft Skills', (employmentProfile.softSkills || []).join(', ')]
      : null,
    empty(employmentProfile.pressureHandling)
      ? ['Under Pressure',   employmentProfile.pressureHandling]
      : null,
    empty(employmentProfile.teamworkStyle)
      ? ['Teamwork Style',   employmentProfile.teamworkStyle]
      : null,
    empty(employmentProfile.supervisionPreference)
      ? ['Supervision',      employmentProfile.supervisionPreference]
      : null,
    empty(employmentProfile.learningAgility)
      ? ['Learning Agility', employmentProfile.learningAgility]
      : null,
    employmentProfile.workplaceValues?.length
      ? ['Workplace Values', (employmentProfile.workplaceValues || []).join(', ')]
      : null,
    empty(employmentProfile.fieldStrengths)
      ? ['Field Strengths',  employmentProfile.fieldStrengths]
      : null,
    empty(contribution)
      ? ['Key Contribution', contribution]
      : null,
  ].filter(Boolean);

  if (readinessRows.length) {
    children.push(sectionHeading('Employment Readiness'));
    const tbl = infoTable(readinessRows);
    if (tbl) children.push(tbl);
    children.push(para('', { after: 60 }));
  }

  // ── Achievements ──────────────────────────────────────────────────────────
  if (achievements.length) {
    children.push(sectionHeading('Key Achievements'));
    const rows = achievements.map((a) => [
      a.title || 'Achievement',
      [a.context, a.result, a.relevance].filter(Boolean).join(' — '),
    ]);
    const tbl = infoTable(rows);
    if (tbl) children.push(tbl);
    children.push(para('', { after: 60 }));
  }

  // ── Projects ──────────────────────────────────────────────────────────────
  if (projects.length) {
    children.push(sectionHeading('Projects & Practical Exposure'));
    const rows = projects.map((p) => [
      p.title || 'Project',
      [p.context, p.role, p.contribution, p.outcome || p.tools].filter(Boolean).join(' — '),
    ]);
    const tbl = infoTable(rows);
    if (tbl) children.push(tbl);
    children.push(para('', { after: 60 }));
  }

  // ── Languages ─────────────────────────────────────────────────────────────
  if (languages.length) {
    children.push(
      sectionHeading('Languages'),
      para(languages.filter(Boolean).join('   ·   '), { color: BRAND.slate, size: 21 }),
    );
  }

  // ── Hobbies ───────────────────────────────────────────────────────────────
  if (hobbies.length) {
    children.push(
      sectionHeading('Hobbies & Interests'),
      para(hobbies.filter(Boolean).join('   ·   '), { color: BRAND.slate, size: 21 }),
    );
  }

  // ── Referees ──────────────────────────────────────────────────────────────
  if (referees.length) {
    children.push(sectionHeading('Professional Referees'));

    const bdr   = (c) => ({ style: BorderStyle.SINGLE, size: 1, color: c || BRAND.rule });
    const bdrSet = { top: bdr(), bottom: bdr(), left: bdr(), right: bdr() };
    const COL   = Math.round(CONTENT_W / 3);

    children.push(
      new Table({
        width:        { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [COL, COL, COL],
        rows: referees.map((r) =>
          new TableRow({
            children: [
              new TableCell({
                width: { size: COL, type: WidthType.DXA }, borders: bdrSet,
                shading: { fill: BRAND.rowAlt, type: ShadingType.CLEAR },
                margins: { top: 100, bottom: 100, left: 130, right: 130 },
                children: [
                  para(r.fullName || '', { bold: true, color: BRAND.navy, size: 20, after: 30 }),
                  para(r.designation || '', { color: BRAND.teal, size: 19, italic: true, after: 0 }),
                ],
              }),
              new TableCell({
                width: { size: COL, type: WidthType.DXA }, borders: bdrSet,
                margins: { top: 100, bottom: 100, left: 130, right: 130 },
                children: [para(r.company || '', { size: 20, after: 0 })],
              }),
              new TableCell({
                width: { size: COL, type: WidthType.DXA }, borders: bdrSet,
                margins: { top: 100, bottom: 100, left: 130, right: 130 },
                children: [
                  para(r.phone || '', { size: 20, color: BRAND.slate, after: 30 }),
                  para(r.email || '', { size: 20, color: BRAND.teal,  after: 0 }),
                ],
              }),
            ],
          })
        ),
      })
    );
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing:   { before: 100 },
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: BRAND.teal } },
        children: [
          run(`${personal.fullName || ''} · ${targetJobTitle}    `, {
            size: 17, color: BRAND.muted,
          }),
          new TextRun({
            children: ['Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES],
            font: 'Calibri', size: 17, color: BRAND.muted,
          }),
        ],
      }),
    ],
  });

  // ── Document ──────────────────────────────────────────────────────────────
  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'bullets',
          levels: [
            {
              level:     0,
              format:    LevelFormat.BULLET,
              text:      '\u2022',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: 480, hanging: 240 } },
                run: { color: BRAND.teal, size: 22 },
              },
            },
          ],
        },
      ],
    },
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: 22, color: BRAND.slate } },
      },
    },
    sections: [
      {
        properties: {
          type: SectionType.CONTINUOUS,
          page: {
            size:   { width: PAGE_W, height: PAGE_H },
            margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
          },
        },
        footers: { default: footer },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}

module.exports = { generateDocxBuffer };
