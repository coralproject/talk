import * as actions from './constants';

export const setView = view => ({
  type: actions.SET_VIEW,
  view,
});

export const setEmail = email => ({
  type: actions.SET_EMAIL,
  email,
});

export const setPassword = password => ({
  type: actions.SET_PASSWORD,
  password,
});
