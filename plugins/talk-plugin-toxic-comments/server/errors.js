const {APIError} = require('../../../errors');

const ErrToxic = new APIError('Comment is toxic', {
  status: 400,
  translation_key: 'COMMENT_IS_TOXIC',
});

module.exports = {
  ErrToxic,
};
