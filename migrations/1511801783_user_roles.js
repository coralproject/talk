const UserModel = require('../models/user');
const { processUpdates } = require('./utils');

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
  async up({ queryBatchSize, updateBatchSize }) {
    const cursor = await UserModel.collection
      .find({
        roles: {
          $exists: true,
        },
      })
      .batchSize(queryBatchSize);

    let updates = [];
    while (await cursor.hasNext()) {
      const user = await cursor.next();

      updates.push({
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
      });

      if (updates.length > updateBatchSize) {
        // Process the updates.
        await processUpdates(UserModel, updates);

        // Clear the updates array.
        updates = [];
      }
    }

    if (updates.length > 0) {
      // Process the updates.
      await processUpdates(UserModel, updates);

      // Clear the updates array.
      updates = [];
    }
  },
};
