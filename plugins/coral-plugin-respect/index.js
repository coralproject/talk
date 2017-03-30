const typeDefs = require('./server/typeDefs');

module.exports = {
  typeDefs,
  resolvers: {
    RootMutation: {
      createRespect(_, {respect: {item_id, item_type}}, {mutators: {Action}}) {
        return Action.create({item_id, item_type, action_type: 'RESPECT'});
      }
    }
  },
  hooks: {
    ActionSummary: {
      __resolveType: {
        post({action_type}) {
          switch (action_type) {
            case 'RESPECT':
              return 'HappyActionSummary';
          }
        }
      }
    }
  }
};
