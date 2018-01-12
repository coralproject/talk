import {
  OPEN_MENU,
  CLOSE_MENU,
  OPEN_BAN_DIALOG,
  CLOSE_BAN_DIALOG,
} from './constants';

export const openMenu = id => ({
  type: OPEN_MENU,
  id,
});

export const closeMenu = () => ({
  type: CLOSE_MENU,
});

export const openBanDialog = ({ commentId, authorId, commentStatus }) => ({
  type: OPEN_BAN_DIALOG,
  commentId,
  authorId,
  commentStatus,
});

export const closeBanDialog = () => ({
  type: CLOSE_BAN_DIALOG,
});
