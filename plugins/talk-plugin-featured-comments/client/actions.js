import {SHOW_TOOLTIP, HIDE_TOOLTIP} from './constants';

export const showTooltip = () => ({
  type: SHOW_TOOLTIP
});

export const hideTooltip = () => ({
  type: HIDE_TOOLTIP
});
