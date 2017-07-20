import {VIEWING_OPTIONS_OPEN, VIEWING_OPTIONS_CLOSE} from './constants';

const initialState = {
  open: false
};

export default function offTopic (state = initialState, action) {
  switch (action.type) {
  case VIEWING_OPTIONS_OPEN:
    return {
      ...state,
      open: true
    };
  case VIEWING_OPTIONS_CLOSE:
    return {
      ...state,
      open: false
    };
  default :
    return state;
  }
}
