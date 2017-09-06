const fetch = require('node-fetch');

const API_ENPOINT = 'https://commentanalyzer.googleapis.com/v1alpha1';

async function getScores(apiKey, text) {
  const response = await fetch(`${API_ENPOINT}/comments:analyze?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      comment: {
        text,
      },

      // TODO: support other languages.
      languages: ['en'],
      requestedAttributes: {
        TOXICITY: {},
        SEVERE_TOXICITY: {},
      }
    }),
  });
  const data = await response.json();
  return {
    TOXICITY: {
      summaryScore: data.attributeScores.TOXICITY.summaryScore.value
    },
    SEVERE_TOXICITY: {
      summaryScore: data.attributeScores.SEVERE_TOXICITY.summaryScore.value
    },
  };
}

module.exports = {
  getScores,
};
