import {
  SET_CONTENT_SLOT,
  RESET_CONTENT_SLOT,
  OPEN_MENU,
  CLOSE_MENU,
} from './constants';

const initialState = {
  contentSlot: null,
  showMenuForComment: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_CONTENT_SLOT:
      return {
        ...state,
        contentSlot: action.slot,
      };
    case RESET_CONTENT_SLOT:
      return {
        ...state,
        contentSlot: initialState.contentSlot,
      };
    case OPEN_MENU:
      return {
        ...state,
        showMenuForComment: action.id,
      };
    case CLOSE_MENU:
      return {
        ...state,
        showMenuForComment: null,
        contentSlot: null,
      };
    default:
      return state;
  }
}
