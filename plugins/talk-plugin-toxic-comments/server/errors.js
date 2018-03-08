const { APIError } = require('errors');

// ErrToxic is sent during a `CreateComment` mutation where
// `input.checkToxicity` is set to true and the comment contains
// toxic language as determined by the perspective service.
const ErrToxic = new APIError('Comment is toxic', {
  status: 400,
  translation_key: 'COMMENT_IS_TOXIC',
});

module.exports = {
  ErrToxic,
};
