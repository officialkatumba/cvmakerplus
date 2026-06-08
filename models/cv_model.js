const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    level: String,
    institution: String,
    qualification: String,
    location: String,
    startDate: String,
    endDate: String,
    details: String
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    company: String,
    location: String,
    role: String,
    startDate: String,
    endDate: String,
    duties: String,
    achievements: [String]
  },
  { _id: false }
);

const refereeSchema = new mongoose.Schema(
  {
    fullName: String,
    designation: String,
    company: String,
    phone: String,
    email: String
  },
  { _id: false }
);

const attributeSchema = new mongoose.Schema(
  {
    personalAttributes: [String],
    softSkills: [String],
    pressureHandling: String,
    teamworkStyle: String,
    supervisionPreference: String,
    learningAgility: String,
    workplaceValues: [String],
    fieldStrengths: String,
    realWorldContribution: String
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: String,
    context: String,
    role: String,
    contribution: String,
    outcome: String,
    tools: String
  },
  { _id: false }
);

const achievementSchema = new mongoose.Schema(
  {
    title: String,
    context: String,
    relevance: String,
    result: String
  },
  { _id: false }
);

const cvSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    visitorSessionId: {
      type: String,
      index: true
    },
    access: {
      phone: {
        type: String,
        index: true
      },
      nrcHash: {
        type: String,
        index: true
      },
      nrcHint: String
    },
    personal: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      dateOfBirth: String,
      gender: String,
      maritalStatus: String
    },
    targetJobTitle: String,
    education: [educationSchema],
    experience: [experienceSchema],
    employmentProfile: attributeSchema,
    projects: [projectSchema],
    achievements: [achievementSchema],
    languages: [String],
    hobbies: [String],
    referees: [refereeSchema],
    ai: {
      summary: String,
      coreCompetencies: [String],
      contributionStatement: String
    },
    finalContent: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CV', cvSchema);
