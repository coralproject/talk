import {SET_CONTENT_SLOT, RESET_CONTENT_SLOT} from './constants';

const initialState = {
  contentSlot: null,
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
  default :
    return state;
  }
}
