import intersection from 'lodash/intersection';

const basicRoles = {
  hasStaffTag: ['ADMIN', 'MODERATOR', 'STAFF']
};

const queryRoles = {
  canAccessConfig: ['ADMIN', 'MODERATOR'],
  canAccessAdmin: ['ADMIN', 'MODERATOR'],
  canViewUserEmails: ['ADMIN']
};

const mutationRoles = {
  canChangeRoles: ['ADMIN'],
  canModerateComments: ['ADMIN', 'MODERATOR']
};

const roles = {...basicRoles, ...queryRoles, ...mutationRoles};

export const can = (user, perms) => {
  for (let perm in perms) {
    const role = roles[perm];
    if (typeof role === 'undefined') {
      continue;
    }
    let grant = intersection(role, user.roles).length > 0;
    return grant;
  }
  return false;
};
