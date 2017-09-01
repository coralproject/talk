import {SET_CONTENT_SLOT, RESET_CONTENT_SLOT} from './constants';

export const setContentSlot = (slot) => ({
  type: SET_CONTENT_SLOT,
  slot,
});

export const resetContentSlot = () => ({
  type: RESET_CONTENT_SLOT,
});
