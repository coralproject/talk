const {check} = require('perms/utils');

module.exports = {
  typeDefs: `
    type Subscription {

      # Subscribe to featured comments.
      commentFeatured(asset_id: ID): Comment
    }
  `,
  resolvers: {
    Subscription: {
      commentFeatured: ({comment}) => {
        return comment;
      },
    },
  },
  setupFunctions: {
    commentFeatured: (options, args) => ({
      commentFeatured: {
        filter: ({comment}, {user}) => {
          if (args.asset_id === null) {
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
        async post(obj, {tag: {name, id, item_type}}, {mutators: {Comment}, pubsub}, info, result) {
          if (name === 'FEATURED' && item_type === 'COMMENTS') {
            const comment = await Comment.setStatus({id: id, status: 'ACCEPTED'});
            if (comment) {
              pubsub.publish('commentFeatured', {comment});
            }
            return result;
          }
          return result;
        },
      },
    },
  },
  tags: [
    {
      name: 'FEATURED',
      permissions: {
        public: true,
        self: true,
        roles: []
      },
      models: ['COMMENTS'],
      created_at: new Date()
    }
  ]
};
