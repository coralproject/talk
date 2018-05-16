import get from 'lodash/get';
import mapValues from 'lodash/mapValues';
import toPairs from 'lodash/toPairs';
import moment from 'moment';

/**
 * getReliability
 * retrieves reliability value as string
 */

export const getReliability = reliabilityValue => {
  if (reliabilityValue === null) {
    return 'neutral';
  } else if (reliabilityValue) {
    return 'reliable';
  } else {
    return 'unreliable';
  }
};

/**
 * isSuspended
 * retrieves boolean based on the user suspension status
 */

export const isSuspended = user => {
  const suspensionUntil = get(user, 'state.status.suspension.until');
  return user && suspensionUntil && new Date(suspensionUntil) > new Date();
};

/**
 * isBanned
 * retrieves boolean based on the user ban status
 */

export const isBanned = user => {
  return get(user, 'state.status.banned.status');
};

/**
 * isUsernameRejected
 * retrieves boolean based on the username status
 */

export const isUsernameRejected = user => {
  return get(user, 'state.status.username.status') === 'REJECTED';
};

/**
 * isUsernameChanged
 * retrieves boolean based on the username status
 */

export const isUsernameChanged = user => {
  return get(user, 'state.status.username.status') === 'CHANGED';
};

/**
 * getActiveStatuses
 * returns an array of active status(es)
 * i.e if suspension is active, it returns suspension
 */

export const getActiveStatuses = user => {
  const statusMap = {
    suspended: isSuspended,
    banned: isBanned,
    usernameRejected: isUsernameRejected,
    usernameChanged: isUsernameChanged,
  };

  return toPairs(mapValues(statusMap, fn => fn(user))).filter(x => x[1]);
};

/**
 * canUsernameBeUpdated
 * retrieves boolean whether a username can be updated or not
 */

export const canUsernameBeUpdated = status => {
  const oldestEditTime = moment()
    .subtract(14, 'days')
    .toDate();

  return !status.username.history.some(({ created_at }) =>
    moment(created_at).isAfter(oldestEditTime)
  );
};
