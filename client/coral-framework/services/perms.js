import intersection from 'lodash/intersection';

const basicRoles = {
  HAS_STAFF_TAG: ['ADMIN', 'MODERATOR', 'STAFF']
};

const queryRoles = {
  UPDATE_CONFIG: ['ADMIN'],
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

  const banned = user.status === 'BANNED';
  const suspended = user.suspension.until && new Date(user.suspension.until) > new Date();

  return perms.every((perm) => {
    if (perm === 'INTERACT_WITH_COMMUNITY') {
      return !banned && !suspended;
    }
    const role = roles[perm];
    if (typeof role === 'undefined') {
      throw new Error(`${perm} is not a valid role`);
    }

    return intersection(role, user.roles).length > 0;
  });
};
