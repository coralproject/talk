import * as actions from '../constants/login';
import pym from 'coral-framework/services/pym';

const initialState = {
  parentUrl: pym.parentUrl || location.href,
  showSignInDialog: false,
  signInDialogFocus: false,
};

export default function login(state = initialState, action) {
  switch (action.type) {
    case actions.FOCUS_SIGNIN_DIALOG:
      return {
        ...state,
        signInDialogFocus: true,
      };
    case actions.BLUR_SIGNIN_DIALOG:
      return {
        ...state,
        signInDialogFocus: false,
      };
    case actions.SHOW_SIGNIN_DIALOG:
      return {
        ...state,
        showSignInDialog: true,
        signInDialogFocus: true,
      };

    case actions.HIDE_SIGNIN_DIALOG:
      return {
        ...state,
        showSignInDialog: false,
        signInDialogFocus: false,
      };
    default:
      return state;
  }
}
