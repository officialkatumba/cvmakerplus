const OpenAI = require('openai');

let client;

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  return client;
}

module.exports = {
  getOpenAIClient,
  model: process.env.OPENAI_MODEL || 'gpt-4.1'
};
