import {OPEN_MENU, CLOSE_MENU, OPEN_DIALOG, CLOSE_DIALOG} from './constants';

const initialState = {
  showMenuForComment: null,
  showDialog: false,
  comment: null
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
  case OPEN_DIALOG:
    return {
      ...state,
      showDialog: true,
      comment: action.comment
    };
  case CLOSE_DIALOG:
    return {
      ...state,
      showDialog: false,
      comment: null
    };
  default :
    return state;
  }
}
