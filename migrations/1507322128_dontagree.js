const ActionModel = require('../models/action');

module.exports = {
  async up() {
    // This will update all the old flags that are 'COMMENT_NOAGREE' to change
    // them to DONTAGREE actions instead.
    return ActionModel.update(
      {
        action_type: 'FLAG',
        group_id: 'COMMENT_NOAGREE',
      },
      {
        $set: {
          action_type: 'DONTAGREE',
          group_id: null,
        },
      },
      {
        multi: true,
      }
    );
  },
};
