const typeDefs = require('./server/typeDefs');
const wrapResponse = require('../../graph/helpers/response');

module.exports = {
  typeDefs,
  resolvers: {
    RootMutation: {
      createRespect(_, {respect: {item_id, item_type}}, {mutators: {Action}}) {
        return wrapResponse(Action.create({item_id, item_type, action_type: 'RESPECT'}));
      }
    }
  },
  hooks: {
    Action: {
      __resolveType: {
        post({action_type}) {
          switch (action_type) {
          case 'RESPECT':
            return 'RespectAction';
          }
        }
      }
    },
    ActionSummary: {
      __resolveType: {
        post({action_type}) {
          switch (action_type) {
          case 'RESPECT':
            return 'RespectActionSummary';
          }
        }
      }
    }
  }
};
