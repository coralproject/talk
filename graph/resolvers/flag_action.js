const { decorateUserField } = require('./util');
const { property } = require('lodash');

const FlagAction = {
  message: property('metadata.message'),
  reason: property('group_id'),
};

decorateUserField(FlagAction, 'user', 'user_id');

module.exports = FlagAction;
