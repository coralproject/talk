import {
  SHOW_BAN_USER_DIALOG,
  HIDE_BAN_USER_DIALOG,
} from '../constants/banUserDialog';
import {
  SHOW_SUSPEND_USER_DIALOG,
  HIDE_SUSPEND_USER_DIALOG,
} from '../constants/suspendUserDialog';

const initialState = {
  modal: false,
};

export default function config(state = initialState, action) {
  switch (action.type) {
    case SHOW_BAN_USER_DIALOG:
      return {
        ...state,
        modal: true,
      };
    case SHOW_SUSPEND_USER_DIALOG:
      return {
        ...state,
        modal: true,
      };
    case HIDE_BAN_USER_DIALOG:
      return {
        ...state,
        modal: false,
      };
    case HIDE_SUSPEND_USER_DIALOG:
      return {
        ...state,
        modal: false,
      };
    default:
      return state;
  }
}
