import {
  SHOW_REJECT_USERNAME_DIALOG,
  HIDE_REJECT_USERNAME_DIALOG,
} from '../constants/rejectUsernameDialog';

const initialState = {
  open: false,
  userId: null,
  username: '',
};

export default function rejectUsernameDialog(state = initialState, action) {
  switch (action.type) {
    case SHOW_REJECT_USERNAME_DIALOG:
      return {
        ...state,
        open: true,
        userId: action.userId,
        username: action.username,
      };
    case HIDE_REJECT_USERNAME_DIALOG:
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
}
