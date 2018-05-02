const { getScores, isToxic } = require('./perspective');
const { ErrToxic } = require('./errors');

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
          console.trace(err); // TODO: log/handle this differently?
          return;
        }

        // Attach scores to metadata.
        input.metadata = Object.assign({}, input.metadata, {
          perspective: scores,
        });

        if (isToxic(scores)) {
          if (input.checkToxicity) {
            throw new ErrToxic();
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
