const { check } = require('perms/utils');

module.exports = {
  typeDefs: `

    type CommentFeaturedData {
      comment: Comment!
      user: User!
    }

    type CommentUnfeaturedData {
      comment: Comment!
      user: User!
    }

    type Subscription {

      # Subscribe to featured comments.
      commentFeatured(asset_id: ID): CommentFeaturedData

      # Subscribe to featured comments.
      commentUnfeatured(asset_id: ID): CommentUnfeaturedData
    }
  `,
  resolvers: {
    Subscription: {
      commentFeatured: ({ user, comment }) => {
        return { user, comment };
      },
      commentUnfeatured: ({ user, comment }) => {
        return { user, comment };
      },
    },
  },
  setupFunctions: {
    commentFeatured: (options, args) => ({
      commentFeatured: {
        filter: ({ comment }, { user }) => {
          if (!args.asset_id) {
            return check(user, ['ADMIN', 'MODERATOR']);
          }
          return comment.asset_id === args.asset_id;
        },
      },
    }),
    commentUnfeatured: (options, args) => ({
      commentUnfeatured: {
        filter: ({ comment }, { user }) => {
          if (!args.asset_id) {
            return check(user, ['ADMIN', 'MODERATOR']);
          }
          return comment.asset_id === args.asset_id;
        },
      },
    }),
  },
  hooks: {
    RootMutation: {
      addTag: {
        async post(
          obj,
          {
            tag: { name, id, item_type },
          },
          {
            user,
            mutators: { Comment },
            pubsub,
          }
        ) {
          if (name === 'FEATURED' && item_type === 'COMMENTS') {
            const comment = await Comment.setStatus({
              id: id,
              status: 'ACCEPTED',
            });
            if (comment) {
              pubsub.publish('commentFeatured', { comment, user });
            }
          }
        },
      },
      removeTag: {
        async post(
          obj,
          {
            tag: { name, id, item_type },
          },
          {
            user,
            loaders: { Comments },
            pubsub,
          }
        ) {
          if (name === 'FEATURED' && item_type === 'COMMENTS') {
            const comment = await Comments.get.load(id);
            if (comment) {
              pubsub.publish('commentUnfeatured', { comment, user });
            }
          }
        },
      },
    },
  },
  tags: [
    {
      name: 'FEATURED',
      permissions: {
        public: true,
        self: false,
        roles: ['ADMIN', 'MODERATOR'],
      },
      models: ['COMMENTS'],
      created_at: new Date(),
    },
  ],
};
