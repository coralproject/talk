import get from 'lodash/get';

export const usernameStatusSelector = state =>
  get(state, 'auth.user.status.username.status');

export const usernameSelector = state => get(state, 'auth.user.username');
