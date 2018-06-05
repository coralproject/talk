import {
  SHOW_REJECT_USERNAME_DIALOG,
  HIDE_REJECT_USERNAME_DIALOG,
} from '../constants/rejectUsernameDialog';

export const showRejectUsernameDialog = ({ userId, username }) => ({
  type: SHOW_REJECT_USERNAME_DIALOG,
  userId,
  username,
});

export const hideRejectUsernameDialog = () => ({
  type: HIDE_REJECT_USERNAME_DIALOG,
});
