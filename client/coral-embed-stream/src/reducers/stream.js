import * as actions from '../constants/stream';

const initialState = {
  activeReplyBox: '',
  commentCountCache: -1,
};

export default function stream(state = initialState, action) {
  switch (action.type) {
  case actions.SET_ACTIVE_REPLY_BOX:
    return {
      ...state,
      activeReplyBox: action.id,
    };
  case actions.SET_COMMENT_COUNT_CACHE:
    return {
      ...state,
      commentCountCache: action.amount,
    };
  default:
    return state;
  }
}
