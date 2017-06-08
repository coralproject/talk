import {VIEWING_OPTIONS_OPEN, VIEWING_OPTIONS_CLOSE} from './constants';

export const openViewingOptions = () => ({
  type: VIEWING_OPTIONS_OPEN
});

export const closeViewingOptions = () => ({
  type: VIEWING_OPTIONS_CLOSE
});
