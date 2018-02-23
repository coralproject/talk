const { merge, get } = require('lodash');
const DOMPurify = require('./DOMPurify');
const linkify = require('linkifyjs/html');
const config = require('./config');

const inputCleanup = ({ htmlBody }) => {
  // htmlBody needs to be present in the request
  if (!htmlBody) {
    throw new Error('htmlBody not present in the request');
  }

  // Let's sanitize the body
  let cleanInput = DOMPurify.sanitize(htmlBody);

  // Highlighting links
  if (config.highlightLinks) {
    cleanInput = linkify(cleanInput, config.linkify);
  }

  return cleanInput;
};

module.exports = {
  RootMutation: {
    createComment: {
      async pre(_, { input }, _context, _info) {
        // Adding the clean body to the comment.metadata field
        input.metadata = merge(get(input, 'metadata'), {
          htmlBody: inputCleanup(input),
        });
      },
    },
    editComment: {
      async pre(_, { edit }, _context, _info) {
        // Adding the clean body to the coment.metadata field
        edit.metadata = merge(get(edit, 'metadata'), {
          htmlBody: inputCleanup(edit),
        });
      },
    },
  },
};
