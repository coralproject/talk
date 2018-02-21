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
  },
};
