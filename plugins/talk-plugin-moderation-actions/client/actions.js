import {OPEN_MENU, CLOSE_MENU, OPEN_DIALOG, CLOSE_DIALOG} from './constants';

export const openMenu = (id) => ({
  type: OPEN_MENU,
  id,
});

export const closeMenu = () => ({
  type: CLOSE_MENU,
});

export const openDialog = () => ({
  type: OPEN_DIALOG,
});

export const closeDialog = () => ({
  type: CLOSE_DIALOG,
});
