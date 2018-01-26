const CommentModel = require('../models/comment');

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
const transformTags = ({ id, tags }) => ({
  query: { id },
  update: {
    $set: {
      tags: tags.map(({ name, assigned_by, created_at }) => ({
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
      })),
    },
  },
});

module.exports = {
  async up({ transformSingleWithCursor }) {
    // Find all comments that have tags.
    const cursor = CommentModel.collection.aggregate(
      [
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
      ],
      { allowDiskUse: true }
    );

    await transformSingleWithCursor(cursor, transformTags, CommentModel);
  },
};
