const { merge } = require('lodash');

module.exports = {
  RootMutation: {
    createComment: {
      async pre(_, { input }, _context, _info) {
        input.metadata = merge(
          {},
          {
            htmlBody: input.htmlBody,
          }
        );
      },
    },
    editComment: {
      async pre(_, { edit }, _context, _info) {
        edit.metadata = merge(
          {},
          {
            htmlBody: edit.htmlBody,
          }
        );
      },
    },
  },
};
