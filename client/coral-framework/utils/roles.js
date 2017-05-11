import includes from 'lodash/includes';

export default {
  canAccessConfig: (user) => includes(user.roles, 'ADMIN'),
  canChangeRoles: user => includes(user.roles, 'ADMIN'),
  hasStaffTag: user => includes(user.roles, 'ADMIN', 'MODERATOR', 'STAFF'),
  canViewUserEmails: user => includes(user.roles, 'ADMIN'),
  canModerate: user => includes(user.roles, 'ADMIN', 'MODERATOR'),
  canAccessAdmin: user => includes(user.roles, 'ADMIN', 'MODERATOR')
};
