const fetch = require('node-fetch');
const {API_ENDPOINT, API_KEY, TOXICITY_THRESHOLD} = require ('./config');

/**
 * Get scores from the perspective api
 * @param  {string}  text  text to be anaylized
 * @return {object}        object containing toxicity scores
 */
async function getScores(text) {
  const response = await fetch(`${API_ENDPOINT}/comments:analyze?key=${API_KEY}`, {
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

/**
 * Get toxicity probability
 * @param  {object} scores  scores as returned by `getScores`
 * @return {number}         toxicity probability from 0 - 1.0
 */
function getProbability(scores) {
  return scores.SEVERE_TOXICITY.summaryScore;
}

/**
 * isToxic determines if given probabilty or scores meets the toxicity threshold.
 * @param  {object|number} scoresOrProbability scores or probability
 * @return {boolean}
 */
function isToxic(scoresOrProbability) {
  const probability = typeof scoresOrProbability === 'object'
    ? getProbability(scoresOrProbability)
    : scoresOrProbability;
  return probability > TOXICITY_THRESHOLD;
}

module.exports = {
  getScores,
  getProbability,
  isToxic,
};
