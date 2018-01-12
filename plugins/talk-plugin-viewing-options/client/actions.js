import { OPEN_MENU, CLOSE_MENU } from './constants';

export const openMenu = () => ({
  type: OPEN_MENU,
});

export const closeMenu = () => ({
  type: CLOSE_MENU,
});
