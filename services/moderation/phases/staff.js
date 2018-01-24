const { IGNORE_FLAGS_AGAINST_STAFF } = require('../../../config');

// If a given user is a staff member, always approve their comment.
module.exports = ctx => {
  if (IGNORE_FLAGS_AGAINST_STAFF && ctx.user && ctx.user.isStaff()) {
    return {
      status: 'ACCEPTED',
    };
  }
};
