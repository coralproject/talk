const fetch = require('node-fetch');
const {
  API_ENDPOINT,
  API_KEY,
  THRESHOLD,
  API_TIMEOUT,
  DO_NOT_STORE,
  API_MODEL,
} = require('./config');
const debug = require('debug')('talk:plugin:toxic-comments');
const get = require('lodash/get');

// Load the global Talk configuration, we want to grab some variables..
const { ROOT_URL } = require('config');

// Use the ROOT_URL to grab the domain to construct a communityID for the
// feedback.
const communityId = `Coral:${ROOT_URL}`;

async function send(method, body) {
  // Perform the fetch.
  const res = await fetch(`${API_ENDPOINT}/${method}?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: API_TIMEOUT,
    body: JSON.stringify(body, null, 2),
  });
  if (!res.ok) {
    return null;
  }

  // Grab the JSON from the request.
  const data = await res.json();

  // Send the data back!
  return data;
}

/**
 * Get scores from the perspective api
 *
 * @param  {string}  text  text to be analyzed
 * @return {object}        object containing toxicity scores
 */
async function getScores(text) {
  debug('Sending to Perspective: %o', text);

  // Send the comment off to be analyzed.
  const data = await send('comments:analyze', {
    comment: {
      text,
    },
    // TODO: support other languages.
    languages: ['en'],
    doNotStore: DO_NOT_STORE,
    requestedAttributes: {
      TOXICITY: {},
      [API_MODEL]: {},
    },
  });
  if (!data || data.error) {
    debug('Received Error when submitting: %o', data.error);
    return {
      TOXICITY: {
        summaryScore: null,
      },
      [API_MODEL]: {
        summaryScore: null,
      },
    };
  }

  return {
    TOXICITY: {
      summaryScore: data.attributeScores.TOXICITY.summaryScore.value,
    },
    [API_MODEL]: {
      summaryScore: data.attributeScores[API_MODEL].summaryScore.value,
    },
  };
}

/**
 * Get toxicity probability from the scores, trying first the selection model,
 * but falling back to the `TOXICITY` model when the selected model isn't found.
 *
 * @param  {object} scores  scores as returned by `getScores`
 * @return {number}         toxicity probability from 0 - 1.0
 */
function getProbability(scores) {
  return get(scores, API_MODEL, scores.TOXICITY).summaryScore;
}

/**
 * isToxic determines if given probability or scores meets the toxicity
 * threshold.
 *
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
 * wrapError will mask API key in error messages.
 *
 * @param {Error} err the error potentially containing the API key
 */
function wrapError(err) {
  if (err.message) {
    err.message = err.message.replace(API_KEY, '***');
  }

  return err;
}

/**
 * maskKeyInError is a decorator that calls fn and masks the
 * API_KEY in errors before throwing.
 *
 * @param  {function} fn Function that returns a Promise
 * @return {function} decorated function
 */
function maskKeyInError(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      throw wrapError(err);
    }
  };
}

/**
 * submitFeedback will send back moderation feedback to Perspective.
 *
 * @param {Object} comment the Comment that feedback is related to
 * @param {Object} asset the Asset where the Comment was made on
 * @param {Object} status the attribute to send back to Perspective
 */
const submitFeedback = (
  {
    id: Coral_comment_id, // Comment ID.
    parent_id: reply_to_id_Coral_comment_id, // Comment parent id (reply parent).
    body: text, // Comment body.
  }, // Comment.
  {
    url, // Asset (article) URL.
  }, // Asset (article).
  status // Either APPROVED, DELETED, or HIGHLIGHTED.
) =>
  // Handle this operation in the next tick, so it does not affect the current
  // comment processing.
  process.nextTick(async () => {
    // Construct a client token.
    const clientToken = `comment:${Coral_comment_id}`;

    try {
      // Send the feedback to perspective.
      const body = await send('comments:suggestscore', {
        comment: {
          text,
        },
        context: {
          entries: [
            {
              text: JSON.stringify({
                url,
                reply_to_id_Coral_comment_id,
                Coral_comment_id,
              }),
            },
          ],
        },
        attributeScores: {
          [status]: {
            summaryScore: {
              value: 1,
            },
          },
        },
        languages: ['EN'],
        communityId,
        clientToken,
      });
      if (!body || body.clientToken !== clientToken) {
        throw new Error(
          `"${JSON.stringify(
            body
          )}" did not contain the clientToken we expected`
        );
      }

      debug(`sent ${status} feedback to perspective`);
    } catch (err) {
      console.error(
        `could not send ${status} feedback to perspective`,
        wrapError(err)
      );
    }
  });

module.exports = {
  getScores: maskKeyInError(getScores),
  getProbability,
  submitFeedback,
  isToxic,
};
