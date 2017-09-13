import {OPEN_MENU, CLOSE_MENU} from './constants';

export const openMenu = (id) => ({
  type: OPEN_MENU,
  id,
});

export const closeMenu = () => ({
  type: CLOSE_MENU,
});
