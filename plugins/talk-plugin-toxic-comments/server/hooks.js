const { getScores, isToxic } = require('./perspective');
const { ErrToxic } = require('./errors');
const debug = require('debug')('talk:plugin:toxic-comments');

function handlePositiveToxic(input) {
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

async function getScore(body) {
  // Try getting scores.
  let scores;
  try {
    scores = await getScores(body);
  } catch (err) {
    // Warn and let mutation pass.
    debug('Error sending to API: %o', err);
    return;
  }

  return scores;
}

module.exports = {
  RootMutation: {
    editComment: {
      pre: async (_, { edit: { body }, edit }) => {
        const scores = await getScore(body);
        if (isToxic(scores)) {
          handlePositiveToxic(edit);
        }
      },
    },
    createComment: {
      async pre(_, { input }, _context, _info) {
        const scores = await getScore(input.body);

        if (isToxic(scores)) {
          if (input.checkToxicity) {
            throw new ErrToxic();
          }

          // Mark the comment as positive toxic.
          handlePositiveToxic(input);
        }

        // Attach scores to metadata.
        input.metadata = Object.assign({}, input.metadata, {
          perspective: scores,
        });
      },
    },
  },
};
