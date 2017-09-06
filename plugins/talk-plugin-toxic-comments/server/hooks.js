const perspective = require('./perspective');
const {ErrToxic} = require('./errors');
const {TOXICITY_THRESHOLD} = require('./constants');
const ActionsService = require('../../../services/actions');

module.exports = {
  RootMutation: {
    createComment: {
      async pre(_, {input}, _context, _info) {

        // Don't call out to perspective when running tests.
        if (process.env.NODE_ENV === 'test') {
          return;
        }

        const apiKey = require('./apiKey');

        // TODO: handle timeouts.
        const scores = await perspective.getScores(apiKey, input.body);

        const isToxic = scores.SEVERE_TOXICITY.summaryScore > TOXICITY_THRESHOLD;
        if (input.checkToxicity && isToxic) {
          throw ErrToxic;
        }
        input.metadata = Object.assign({}, input.metadata, {
          perspective: scores,
        });

        if (isToxic) {
          input.status = 'PREMOD';
        }
      },
      async post(_, _input, _context, _info, result) {

        // Perspective is not available when running tests.
        if (process.env.NODE_ENV === 'test') {
          return result;
        }

        const score = result.comment.metadata.perspective.SEVERE_TOXICITY.summaryScore;
        const isToxic = score > TOXICITY_THRESHOLD;
        if (isToxic) {

          // TODO: this is kind of fragile, we should refactor this to resolve
          // all these const's that we're using like 'COMMENTS', 'FLAG' to be
          // defined in a checkable schema.
          await ActionsService.create({
            item_id: result.comment.id,
            item_type: 'COMMENTS',
            action_type: 'FLAG',
            user_id: null,
            group_id: 'Comment contains toxic language',
            metadata: {}
          });
        }
        return result;
      },
    },
  },
};
