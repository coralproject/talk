const get = require('lodash/get');

module.exports = {
  Comment: {
    toxicity: comment =>
      get(comment, 'metadata.perspective.${API_MODEL}.summaryScore'),
  },
};
