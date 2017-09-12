import {OPEN_TOOLTIP, CLOSE_TOOLTIP} from './constants';

const initialState = {
  showTooltipForComment: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case OPEN_TOOLTIP:
    return {
      ...state,
      showTooltipForComment: action.id,
    };
  case CLOSE_TOOLTIP:
    return {
      ...state,
      showTooltipForComment: null,
      contentSlot: null,
    };
  default :
    return state;
  }
}
