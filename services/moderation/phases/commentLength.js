const { ErrCommentTooShort } = require('../../../errors');

// This phase checks to see if the comment is long enough.
module.exports = (
  ctx,
  comment,
  { asset: { settings: { charCountEnable, charCount } } }
) => {
  // Check to see if the body is too short, if it is, then complain about it!
  if (comment.body.length < 2) {
    throw ErrCommentTooShort;
  }

  // Reject if the comment is too long
  if (charCountEnable && comment.body.length > charCount) {
    // Add the flag related to Trust to the comment.
    return {
      status: 'REJECTED',
      actions: [
        {
          action_type: 'FLAG',
          user_id: null,
          group_id: 'BODY_COUNT',
          metadata: {
            count: comment.body.length,
          },
        },
      ],
    };
  }
};
