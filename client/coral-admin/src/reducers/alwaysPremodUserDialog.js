import {
  SHOW_ALWAYS_PREMOD_USER_DIALOG,
  HIDE_ALWAYS_PREMOD_USER_DIALOG,
} from '../constants/alwaysPremodUserDialog';

const initialState = {
  open: false,
  userId: null,
  username: '',
};

export default function alwaysPremodUserDialog(state = initialState, action) {
  switch (action.type) {
    case SHOW_ALWAYS_PREMOD_USER_DIALOG:
      return {
        ...state,
        open: true,
        userId: action.userId,
        username: action.username,
      };
    case HIDE_ALWAYS_PREMOD_USER_DIALOG:
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
}
