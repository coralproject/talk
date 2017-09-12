import {OPEN_TOOLTIP, CLOSE_TOOLTIP} from './constants';

export const openTooltip = (id) => ({
  type: OPEN_TOOLTIP,
  id,
});

export const closeTooltip = () => ({
  type: CLOSE_TOOLTIP,
});
