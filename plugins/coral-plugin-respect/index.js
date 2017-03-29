const typeDefs = require('./server/typeDefs');

module.exports = {
  typeDefs,
  resolvers: {
    RootMutation: {
      createRespect(_, {respect: {item_id, item_type}}, {mutators: {Action}}) {
        return Action.create({item_id, item_type, action_type: 'RESPECT'});
      }
    }
  }
};
