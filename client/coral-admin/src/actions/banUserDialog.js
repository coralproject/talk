import {
  SHOW_BAN_USER_DIALOG,
  HIDE_BAN_USER_DIALOG,
} from '../constants/banUserDialog';

export const showBanUserDialog = ({
  userId,
  username,
  commentId,
  commentStatus,
}) => ({
  type: SHOW_BAN_USER_DIALOG,
  userId,
  username,
  commentId,
  commentStatus,
});

export const hideBanUserDialog = () => ({ type: HIDE_BAN_USER_DIALOG });
