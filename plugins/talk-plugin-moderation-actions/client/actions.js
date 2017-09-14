import {OPEN_MENU, CLOSE_MENU, OPEN_DIALOG, CLOSE_DIALOG} from './constants';

export const openMenu = (id) => ({
  type: OPEN_MENU,
  id,
});

export const closeMenu = () => ({
  type: CLOSE_MENU,
});

export const openDialog = (comment) => ({
  type: OPEN_DIALOG,
  comment
});

export const closeDialog = () => ({
  type: CLOSE_DIALOG,
});
