import {SHOW_REJECT_CONFIRMATION, HIDE_REJECT_CONFIRMATION} from '../constants/showRejectConfirmation';

const initialState = {
  show: false,
  commentId: null,
};

export default function showRejectConfirmation(state = initialState, action) {
  switch(action.type) {
  case SHOW_REJECT_CONFIRMATION:
    return {
      ...state,
      show: true,
      commentId: action.commentId,
    };
  case HIDE_REJECT_CONFIRMATION:
    return {
      ...state,
      show: false,
    };
  default:
    return state;
  }
}
