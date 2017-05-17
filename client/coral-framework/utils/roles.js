import intersection from 'lodash/intersection';

const basicRoles = {
  HAS_STAFF_TAG: ['ADMIN', 'MODERATOR', 'STAFF']
};

const queryRoles = {
  UPDATE_CONFIG: ['ADMIN', 'MODERATOR'],
  ACCESS_ADMIN: ['ADMIN', 'MODERATOR'],
  VIEW_USER_EMAILS: ['ADMIN']
};

const mutationRoles = {
  CHANGE_ROLES: ['ADMIN'],
  MODERATE_COMMENTS: ['ADMIN', 'MODERATOR']
};

const roles = {...basicRoles, ...queryRoles, ...mutationRoles};

export const can = (user, ...perms) => {

  if (!user) {
    return false;
  }

  return perms.every((perm) => {
    const role = roles[perm];
    if (typeof role === 'undefined') {
      throw new Error(`${perm} is not a valid role`);
    }

    return intersection(role, user.roles).length > 0;
  });
};
