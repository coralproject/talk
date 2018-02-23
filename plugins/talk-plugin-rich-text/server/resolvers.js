const { get } = require('lodash');

module.exports = {
  Comment: {
    // Get the richTextBody, or send null.
    richTextBody: comment => get(comment, 'metadata.richTextBody', null),
  },
};
