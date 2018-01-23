const { getScores, isToxic } = require('./perspective');
const { ErrToxic } = require('./errors');

// We don't add the hooks during _test_ as the perspective API is not available.
if (process.env.NODE_ENV === 'test') {
  return null;
}

module.exports = {
  RootMutation: {
    createComment: {
      async pre(_, { input }, _context, _info) {
        // Try getting scores.
        let scores;
        try {
          scores = await getScores(input.body);
        } catch (err) {
          // Warn and let mutation pass.
          console.trace(err);
          return;
        }

        // Attach scores to metadata.
        input.metadata = Object.assign({}, input.metadata, {
          perspective: scores,
        });

        if (isToxic(scores)) {
          if (input.checkToxicity) {
            throw ErrToxic;
          }

          input.status = 'SYSTEM_WITHHELD';
          input.actions =
            input.actions && input.actions.length >= 0 ? input.actions : [];
          input.actions.push({
            action_type: 'FLAG',
            user_id: null,
            group_id: 'TOXIC_COMMENT',
            metadata: {},
          });
        }
      },
    },
  },
};
