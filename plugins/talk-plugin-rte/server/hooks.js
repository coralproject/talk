const TurndownService = require('turndown');

module.exports = {
  RootMutation: {
    createComment: {
      async pre(_, { input }, _context, _info) {
        // Saving the HTML comment as Markdown
        const ts = new TurndownService();
        input.body = ts.turndown(input.body);
      },
    },
  },
};
