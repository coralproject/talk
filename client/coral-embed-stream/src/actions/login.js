import * as actions from '../constants/login';
import { checkLogin } from 'coral-framework/actions/auth';

export const showSignInDialog = () => ({
  type: actions.SHOW_SIGNIN_DIALOG,
});

export const hideSignInDialog = () => dispatch => {
  dispatch(checkLogin());
  dispatch({ type: actions.HIDE_SIGNIN_DIALOG });
};

export const focusSignInDialog = () => ({
  type: actions.FOCUS_SIGNIN_DIALOG,
});

export const blurSignInDialog = () => ({
  type: actions.BLUR_SIGNIN_DIALOG,
});
