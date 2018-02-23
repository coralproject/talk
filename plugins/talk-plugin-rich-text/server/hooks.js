const { merge, get } = require('lodash');
const DOMPurify = require('./DOMPurify');
const linkify = require('linkifyjs/html');
const config = require('./config');

const inputCleanup = ({ richTextBody }) => {
  // richTextBody needs to be present in the request
  if (!richTextBody) {
    throw new Error('`richTextBody` field not present in the request');
  }

  // Let's sanitize the body
  let cleanInput = DOMPurify.sanitize(richTextBody);

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
          richTextBody: inputCleanup(input),
        });
      },
    },
    editComment: {
      async pre(_, { edit }, _context, _info) {
        // Adding the clean body to the coment.metadata field
        edit.metadata = merge(get(edit, 'metadata'), {
          richTextBody: inputCleanup(edit),
        });
      },
    },
  },
};
