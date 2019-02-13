import {
  SHOW_ALWAYS_PREMOD_USER_DIALOG,
  HIDE_ALWAYS_PREMOD_USER_DIALOG,
} from '../constants/alwaysPremodUserDialog.js';

export const showAlwaysPremodUserDialog = ({ userId, username }) => ({
  type: SHOW_ALWAYS_PREMOD_USER_DIALOG,
  userId,
  username,
});

export const hideAlwaysPremodUserDialog = () => ({
  type: HIDE_ALWAYS_PREMOD_USER_DIALOG,
});
