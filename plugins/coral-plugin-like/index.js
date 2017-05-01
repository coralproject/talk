const {readFileSync} = require('fs');
const path = require('path');
const wrapResponse = require('../../graph/helpers/response');

module.exports = {
  typeDefs: readFileSync(path.join(__dirname, 'server/typeDefs.graphql'), 'utf8'),
  resolvers: {
    RootMutation: {
      createRespect(_, {like: {item_id, item_type}}, {mutators: {Action}}) {
        return wrapResponse('like')(Action.create({item_id, item_type, action_type: 'LIKE'}));
      }
    }
  },
  hooks: {
    Action: {
      __resolveType: {
        post({action_type}) {
          switch (action_type) {
          case 'LIKE':
            return 'LikeAction';
          }
        }
      }
    },
    ActionSummary: {
      __resolveType: {
        post({action_type}) {
          switch (action_type) {
          case 'LIKE':
            return 'LikeActionSummary';
          }
        }
      }
    }
  }
};
