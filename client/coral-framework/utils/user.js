import get from 'lodash/get';

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
