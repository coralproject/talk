import {
  SET_CONTENT_SLOT,
  RESET_CONTENT_SLOT,
  OPEN_MENU,
  CLOSE_MENU,
} from './constants';

export const setContentSlot = slot => ({
  type: SET_CONTENT_SLOT,
  slot,
});

export const resetContentSlot = () => ({
  type: RESET_CONTENT_SLOT,
});

export const openMenu = id => ({
  type: OPEN_MENU,
  id,
});

export const closeMenu = () => ({
  type: CLOSE_MENU,
});
