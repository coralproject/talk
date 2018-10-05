const fetch = require('node-fetch');
const {
  API_ENDPOINT,
  API_KEY,
  THRESHOLD,
  API_TIMEOUT,
  DO_NOT_STORE,
} = require('./config');
const debug = require('debug')('talk:plugin:toxic-comments');

/**
 * Get scores from the perspective api
 * @param  {string}  text  text to be anaylized
 * @return {object}        object containing toxicity scores
 */
async function getScores(text) {
  debug('Sending to Perspective: %o', text);

  const response = await fetch(
    `${API_ENDPOINT}/comments:analyze?key=${API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: API_TIMEOUT,
      body: JSON.stringify({
        comment: {
          text,
        },

        // TODO: support other languages.
        languages: ['en'],
        doNotStore: DO_NOT_STORE,
        requestedAttributes: {
          TOXICITY: {},
          SEVERE_TOXICITY: {},
        },
      }),
    }
  );
  const data = await response.json();

  // If we get an error, just say it's not a toxic comment.
  let retData = {
    TOXICITY: {
      summaryScore: 0.0,
    },
    SEVERE_TOXICITY: {
      summaryScore: 0.0,
    },
  };

  if (data.error) {
    debug('Recieved Error when submitting: %o', data.error);
  } else {
    retData.TOXICITY.summaryScore =
      data.attributeScores.TOXICITY.summaryScore.value;
    retData.SEVERE_TOXICITY.summaryScore =
      data.attributeScores.SEVERE_TOXICITY.summaryScore.value;
  }

  return retData;
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
  const probability =
    typeof scoresOrProbability === 'object'
      ? getProbability(scoresOrProbability)
      : scoresOrProbability;
  return probability > THRESHOLD;
}

/**
 * maskKeyInError is a decorator that calls fn and masks the
 * API_KEY in errors before throwing.
 * @param  {function} fn Function that returns a Promise
 * @return {function} decorated function
 */
function maskKeyInError(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      if (err.message) {
        err.message = err.message.replace(API_KEY, '***');
      }
      throw err;
    }
  };
}

module.exports = {
  getScores: maskKeyInError(getScores),
  getProbability,
  isToxic,
};
