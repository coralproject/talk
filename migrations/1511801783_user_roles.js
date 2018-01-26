const UserModel = require('../models/user');

const findNewRole = roles => {
  if (roles.includes('ADMIN')) {
    return 'ADMIN';
  } else if (roles.includes('MODERATOR')) {
    return 'MODERATOR';
  } else if (roles.includes('STAFF')) {
    return 'STAFF';
  }

  return 'COMMENTER';
};

module.exports = {
  async up({ transformSingleWithCursor }) {
    const cursor = UserModel.collection.find({
      roles: {
        $exists: true,
      },
    });

    await transformSingleWithCursor(
      cursor,
      user => ({
        query: {
          id: user.id,
        },
        update: {
          $set: {
            role: Array.isArray(user.roles)
              ? findNewRole(user.roles)
              : 'COMMENTER',
          },
          $unset: {
            roles: '',
          },
        },
      }),
      UserModel
    );
  },
};
