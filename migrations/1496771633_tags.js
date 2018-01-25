const CommentModel = require('../models/comment');
const { processUpdates } = require('./utils');

module.exports = {
  async up({ queryBatchSize, updateBatchSize }) {
    // Find all comments that have tags.
    const cursor = await CommentModel.collection
      .aggregate([
        {
          $match: {
            tags: {
              $exists: true,
              $ne: [],
            },
          },
        },
        {
          $project: {
            id: true,
            tags: true,
          },
        },
      ])
      .batchSize(queryBatchSize);

    let updates = [];
    while (await cursor.hasNext()) {
      let { id, tags } = await cursor.next();

      // OLD
      //
      // [
      //   {
      //     name: 'OFF_TOPIC',
      //     assigned_by: '',
      //     created_at: new Date()
      //   }
      // ]

      // NEW
      //
      // [
      //   {
      //     tag: {
      //       name: 'OFF_TOPIC',
      //       permissions: {
      //         public: true,
      //         self: false,
      //         roles: []
      //       },
      //       models: ['COMMENTS'],
      //       created_at: new Date()
      //     },
      //     assigned_by: '',
      //     created_at: new Date()
      //   }
      // ]

      // Remap the tag structure.
      tags = tags.map(({ name, assigned_by, created_at }) => ({
        tag: {
          name,
          permissions: {
            public: true,
            self: name === 'OFF_TOPIC', // at the time of migration, only off topic tags were self assigning
            roles: [],
          },
          models: ['COMMENTS'],
          created_at,
        },
        assigned_by,
        created_at,
      }));

      updates.push({ query: { id }, update: { $set: { tags } } });

      if (updates.length > updateBatchSize) {
        // Process the updates.
        await processUpdates(CommentModel, updates);

        // Clear the updates array.
        updates = [];
      }
    }

    if (updates.length > 0) {
      // Process the updates.
      await processUpdates(CommentModel, updates);

      // Clear the updates array.
      updates = [];
    }
  },
};
