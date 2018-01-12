const CommentModel = require('../models/comment');

module.exports = {
  async up() {
    // Find all comments that have tags.
    let comments = await CommentModel.aggregate([
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
    ]);

    // If no comments were found, nothing needs to be done!
    if (comments.length <= 0) {
      return;
    }

    const updates = [];

    // Loop over the comments retrieved, updating the tag structure.
    for (let { id, tags } of comments) {
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
    }

    if (updates.length > 0) {
      // Create a new batch operation.
      let batch = CommentModel.collection.initializeUnorderedBulkOp();

      for (const { query, update } of updates) {
        // Execute the batch operation.
        batch.find(query).updateOne(update);
      }

      // Execute the batch update operation.
      await batch.execute();
    }
  },
};
