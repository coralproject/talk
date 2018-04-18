const { TalkError } = require('errors');

// ErrToxic is sent during a `CreateComment` mutation where
// `input.checkToxicity` is set to true and the comment contains
// toxic language as determined by the perspective service.
class ErrToxic extends TalkError {
  constructor() {
    super('Comment is toxic', {
      status: 400,
      translation_key: 'COMMENT_IS_TOXIC',
    });
  }
}

module.exports = {
  ErrToxic,
};
