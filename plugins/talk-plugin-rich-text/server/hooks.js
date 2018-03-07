const { merge, get } = require('lodash');
const DOMPurify = require('./DOMPurify');
const linkify = require('linkifyjs/html');
const config = require('./config');

const inputCleanup = ({ richTextBody }) => {
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
      async pre(_, { input }) {
        // Adding the clean body to the comment.metadata field
        input.metadata = merge(get(input, 'metadata', {}), {
          richTextBody: inputCleanup(input),
        });
      },
    },
    editComment: {
      async pre(_, { edit }) {
        // Adding the clean body to the comment.metadata field
        edit.metadata = merge(get(edit, 'metadata', {}), {
          richTextBody: inputCleanup(edit),
        });
      },
    },
  },
};
