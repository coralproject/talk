const { decorateUserField } = require('./util');

const TagLink = {};

decorateUserField(TagLink, 'assigned_by');

module.exports = TagLink;
