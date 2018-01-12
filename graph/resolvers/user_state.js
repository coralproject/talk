const { VIEW_USER_STATUS } = require('../../perms/constants');

const UserState = {
  status: (user, args, ctx) => {
    if (
      ctx.user &&
      (ctx.user.id === user.id || ctx.user.can(VIEW_USER_STATUS))
    ) {
      return user.status;
    }
  },
};

module.exports = UserState;
