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

const processUpdates = async updates => {
  // Create a new batch operation.
  const bulk = UserModel.collection.initializeUnorderedBulkOp();

  for (const { query, update } of updates) {
    bulk.find(query).updateOne(update);
  }

  // Execute the bulk update operation.
  await bulk.execute();
};

module.exports = {
  async up() {
    const cursor = await UserModel.collection
      .find({
        roles: {
          $exists: true,
        },
      })
      .batchSize(100);

    const updates = [];
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

      if (updates.length > 1000) {
        // Process the updates.
        await processUpdates(updates);

        // Clear the updates array.
        updates = [];
      }
    }

    if (updates.length > 0) {
      // Process the updates.
      await processUpdates(updates);

      // Clear the updates array.
      updates = [];
    }
  },
};
