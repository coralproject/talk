const { decorateWithPermissionCheck, checkSelfField } = require('./util');
const { VIEW_USER_STATUS } = require('../../perms/constants');

const UserState = {};

decorateWithPermissionCheck(
  UserState,
  { status: [VIEW_USER_STATUS] },
  checkSelfField('id')
);

module.exports = UserState;
