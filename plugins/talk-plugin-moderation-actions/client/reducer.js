import {OPEN_MENU, CLOSE_MENU} from './constants';

const initialState = {
  showMenuForComment: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case OPEN_MENU:
    return {
      ...state,
      showMenuForComment: action.id
    };
  case CLOSE_MENU:
    return {
      ...state,
      showMenuForComment: null
    };
  default :
    return state;
  }
}
