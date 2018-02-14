const { APIError } = require('errors');

// ErrSpam is sent during a `CreateComment` mutation where
// `input.checkSpam` is set to true and the comment contains
// detected spam as determined by the akismet service.
const ErrSpam = new APIError('Comment is spam', {
  status: 400,
  translation_key: 'COMMENT_IS_SPAM',
});

module.exports = {
  ErrSpam,
};
