const {readFileSync} = require('fs');
const path = require('path');
const wrapResponse = require('../../graph/helpers/response');

module.exports = {
  typeDefs: readFileSync(path.join(__dirname, 'server/typeDefs.graphql'), 'utf8'),
  resolvers: {
    RootMutation: {
      createLove(_, {love: {item_id, item_type}}, {mutators: {Action}}) {
        return wrapResponse('love')(Action.create({item_id, item_type, action_type: 'LOVE'}));
      }
    }
  },
  hooks: {
    Action: {
      __resolveType: {
        post({action_type}) {
          switch (action_type) {
          case 'LOVE':
            return 'LoveAction';
          }
        }
      }
    },
    ActionSummary: {
      __resolveType: {
        post({action_type}) {
          switch (action_type) {
          case 'LOVE':
            return 'LoveActionSummary';
          }
        }
      }
    }
  }
};

