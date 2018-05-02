import * as actions from './constants';

export const showAddEmailDialog = () => ({
  type: actions.SHOW_ADD_EMAIL_DIALOG,
});

export const hideAddEmailDialog = () => ({
  type: actions.HIDE_ADD_EMAIL_DIALOG,
});
