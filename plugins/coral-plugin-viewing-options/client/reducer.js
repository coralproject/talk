import {OPEN_VIEWING_OPTIONS, CLOSE_VIEWING_OPTIONS} from './constants';

const initialState = {
  open: false
};

export default function offTopic (state = initialState, action) {
  switch (action.type) {
  case OPEN_VIEWING_OPTIONS:
    return {
      ...state,
      open: true
    };
  case CLOSE_VIEWING_OPTIONS:
    return {
      ...state,
      open: false
    };
  default :
    return state;
  }
}
