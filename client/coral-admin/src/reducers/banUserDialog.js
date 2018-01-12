import {
  SHOW_BAN_USER_DIALOG,
  HIDE_BAN_USER_DIALOG,
} from '../constants/banUserDialog';

const initialState = {
  open: false,
  userId: null,
  username: '',
  commentId: null,
  commentStatus: '',
};

export default function banUserDialog(state = initialState, action) {
  switch (action.type) {
    case SHOW_BAN_USER_DIALOG:
      return {
        ...state,
        open: true,
        userId: action.userId,
        username: action.username,
        commentId: action.commentId,
        commentStatus: action.commentStatus,
      };
    case HIDE_BAN_USER_DIALOG:
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
}
