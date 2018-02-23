const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const { merge, get } = require('lodash');
const config = require('./config');

// Initializing JSDOM and DOMPurify
const window = new JSDOM('', config.jsdom).window;
const DOMPurify = createDOMPurify(window);

module.exports = {
  RootMutation: {
    createComment: {
      async pre(_, { input }, _context, _info) {
        // Let's sanitize the body
        const dirtyInput = input.htmlBody;

        const cleanInput = DOMPurify.sanitize(dirtyInput, config.dompurify);

        // Adding the clean body to the comment.metadata field
        input.metadata = merge(get(input, 'metadata'), {
          htmlBody: cleanInput,
        });
      },
    },
    editComment: {
      async pre(_, { edit }, _context, _info) {
        // Let's sanitize the body
        const dirtyInput = edit.htmlBody;

        const cleanInput = DOMPurify.sanitize(dirtyInput, config.dompurify);

        // Adding the clean body to the comment.metadata field
        edit.metadata = merge(get(edit, 'metadata'), {
          htmlBody: cleanInput,
        });
      },
    },
  },
};
