const { decorateUserField } = require('./util');

const SuspensionStatusHistory = {};

decorateUserField(SuspensionStatusHistory, 'assigned_by');

module.exports = SuspensionStatusHistory;
