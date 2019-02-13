const { decorateUserField } = require('./util');

const AlwaysPremodStatusHistory = {};

decorateUserField(AlwaysPremodStatusHistory, 'assigned_by');

module.exports = AlwaysPremodStatusHistory;
