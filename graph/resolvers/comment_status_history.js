const { decorateUserField } = require('./util');

const CommentStatusHistory = {};

decorateUserField(CommentStatusHistory, 'assigned_by');

module.exports = CommentStatusHistory;
