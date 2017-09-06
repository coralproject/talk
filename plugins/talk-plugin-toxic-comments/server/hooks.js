const {getScores, isToxic} = require('./perspective');
const {ErrToxic} = require('./errors');
const ActionsService = require('../../../services/actions');

// We don't add the hooks during _test_ as the perspective API is not available.
if (process.env.NODE_ENV === 'test') {
  return null;
}

module.exports = {
  RootMutation: {
    createComment: {
      async pre(_, {input}, _context, _info) {

        // TODO: handle timeouts.
        const scores = await getScores(input.body);
        const commentIsToxic = isToxic(scores);

        if (input.checkToxicity && commentIsToxic) {
          throw ErrToxic;
        }

        // attach scores to metadata.
        input.metadata = Object.assign({}, input.metadata, {
          perspective: scores,
        });

        if (commentIsToxic) {

          // TODO: this should have a different status than Premod.
          input.status = 'PREMOD';
        }
      },
      async post(_, _input, _context, _info, result) {
        if (isToxic(result.comment.metadata.perspective)) {

          // TODO: this is kind of fragile, we should refactor this to resolve
          // all these const's that we're using like 'COMMENTS', 'FLAG' to be
          // defined in a checkable schema.

          // Add a flag to the comment.
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
