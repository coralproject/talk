const get = require('lodash/get');
const { API_MODEL } = require('./config');

module.exports = {
  Comment: {
    toxicity: comment =>
      // Try to get the score from the custom model first, but fall back to the
      // TOXICITY score if it isn't provided.
      get(
        comment,
        `metadata.perspective.${API_MODEL}.summaryScore`,
        get(comment, 'metadata.perspective.TOXICITY.summaryScore')
      ),
  },
};
