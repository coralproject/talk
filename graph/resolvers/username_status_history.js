const { decorateUserField } = require('./util');

const UsernameStatusHistory = {};

decorateUserField(UsernameStatusHistory, 'assigned_by');

module.exports = UsernameStatusHistory;
