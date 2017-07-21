import {SHOW_TOOLTIP, HIDE_TOOLTIP} from './constants';

const initialState = {
  tooltip: false
};

export default function featured (state = initialState, action) {
  switch (action.type) {
  case SHOW_TOOLTIP: 
    return {
      ...state,
      tooltip: true
    };
  case HIDE_TOOLTIP: 
    return {
      ...state,
      tooltip: false
    };
  default :
    return state;
  }
}
