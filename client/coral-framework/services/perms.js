import get from 'lodash/get';
import includes from 'lodash/includes';
import { ADMIN, MODERATOR, STAFF } from '../constants/roles';
import { UNSET, REJECTED, CHANGED } from '../constants/usernameStatus';

// =========================================================================
// BASIC PERMISSIONS
// =========================================================================

const basicPerms = {
  INTERACT_WITH_COMMUNITY: user => {
    const usernameChangeInProgress = includes(
      [UNSET, REJECTED, CHANGED],
      get(user, 'status.username.status')
    );
    const banned = get(user, 'status.banned.status');
    const suspensionUntil = get(user, 'status.suspension.until');
    const suspended = suspensionUntil && new Date(suspensionUntil) > new Date();

    return !usernameChangeInProgress && !banned && !suspended;
  },
  EDIT_NAME: user => {
    return includes([UNSET, REJECTED], get(user, 'status.username.status'));
  },
};

// =========================================================================
// PERMISSIONS BY ROLE
// =========================================================================

const basicRoles = {
  HAS_STAFF_TAG: [ADMIN, MODERATOR, STAFF],
};

const queryRoles = {
  UPDATE_ASSET_CONFIG: [ADMIN, MODERATOR],
  UPDATE_CONFIG: [ADMIN],
  ACCESS_ADMIN: [ADMIN, MODERATOR],
  VIEW_USER_EMAILS: [ADMIN],
};

const mutationRoles = {
  CHANGE_ROLES: [ADMIN],
  MODERATE_COMMENTS: [ADMIN, MODERATOR],
};

const roles = { ...basicRoles, ...queryRoles, ...mutationRoles };

export const can = (user, ...perms) => {
  if (!user) {
    return false;
  }

  return perms.every(perm => {
    // Basic Permissions
    const permAction = basicPerms[perm];
    if (typeof permAction !== 'undefined') {
      return permAction(user);
    }

    // Permissions by Role
    const role = roles[perm];
    if (typeof role === 'undefined') {
      throw new Error(`${perm} is not a valid role or permission`);
    }

    return role.includes(user.role);
  });
};
