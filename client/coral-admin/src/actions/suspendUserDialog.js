import {
  SHOW_SUSPEND_USER_DIALOG,
  HIDE_SUSPEND_USER_DIALOG,
} from '../constants/suspendUserDialog.js';

export const showSuspendUserDialog = ({
  userId,
  username,
  commentId,
  commentStatus,
}) => ({
  type: SHOW_SUSPEND_USER_DIALOG,
  userId,
  username,
  commentId,
  commentStatus,
});

export const hideSuspendUserDialog = () => ({ type: HIDE_SUSPEND_USER_DIALOG });
