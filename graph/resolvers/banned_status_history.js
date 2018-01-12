const { decorateUserField } = require('./util');

const BannedStatusHistory = {};

decorateUserField(BannedStatusHistory, 'assigned_by');

module.exports = BannedStatusHistory;
