import {
  SHOW_SUSPEND_USER_DIALOG,
  HIDE_SUSPEND_USER_DIALOG,
} from '../constants/suspendUserDialog';

const initialState = {
  open: false,
  userId: null,
  username: '',
  commentId: null,
  commentStatus: '',
};

export default function suspendUserDialog(state = initialState, action) {
  switch (action.type) {
    case SHOW_SUSPEND_USER_DIALOG:
      return {
        ...state,
        open: true,
        userId: action.userId,
        username: action.username,
        commentId: action.commentId,
        commentStatus: action.commentStatus,
      };
    case HIDE_SUSPEND_USER_DIALOG:
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
}
