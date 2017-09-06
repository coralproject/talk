const {APIError} = require('../../../errors');

const ErrNoComment = new APIError('Comment must be provided', {
  status: 400,
});

const ErrToxic = new APIError('Comment is toxic', {
  status: 400,
  translation_key: 'COMMENT_IS_TOXIC',
});

module.exports = {
  ErrNoComment,
  ErrToxic,
};
