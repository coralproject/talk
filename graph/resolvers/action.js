const { decorateUserField } = require('./util');

const Action = {
  __resolveType({ action_type }) {
    switch (action_type) {
      case 'DONTAGREE':
        return 'DontAgreeAction';
      case 'FLAG':
        return 'FlagAction';
      default:
        return undefined;
    }
  },
};

decorateUserField(Action, 'user', 'user_id');

module.exports = Action;
