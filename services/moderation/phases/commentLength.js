const { ErrCommentTooShort, ErrCommentTooLong } = require('../../../errors');

// This phase checks to see if the comment is long enough.
module.exports = (
  ctx,
  comment,
  {
    asset: {
      settings: { charCountEnable, charCount },
    },
  }
) => {
  // Check to see if the body is too short, if it is, then complain about it!
  if (comment.body.length < 2) {
    throw new ErrCommentTooShort(comment.body.length);
  }

  // Reject if the comment is too long
  if (charCountEnable && comment.body.length > charCount) {
    throw new ErrCommentTooLong(comment.body.length, charCount);
  }
};
