const { get } = require('lodash');

module.exports = {
  Comment: {
    spam: comment => get(comment, 'metadata.akismet', null),
  },
};
