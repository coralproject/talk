import * as actions from '../constants/auth';
import {base, handleResp, getInit} from '../helpers';

export const showSignInDialog = () => ({
  type: actions.SHOW_SIGNIN_DIALOG
});

export const hideSignInDialog = ()  => ({
  type: actions.HIDE_SIGNIN_DIALOG
});

export const loginFacebook = () => dispatch => {
  dispatch(loginFacebookRequest());
  window.open(
    `${base}/auth/facebook`,
    'Continue with Facebook',
    'menubar=0,resizable=0,width=500,height=500,top=200,left=500'
  );
};

export const loginFacebookCallback = (err, data) => {
  let user;

  if (err) {
    console.error(err);
    return;
  }

  try {
    user = JSON.parse(data);
  } catch (err) {
    console.error('Can\'t parse the user json', err);
    return;
  }

  console.log('User was loaded!', user);
};

export const logout = () => dispatch => {
  dispatch(logoutRequest());
  fetch(`${base}/auth`, getInit('DELETE'))
  .then(handleResp)
  .then(() => dispatch(dispatch(logoutSuccess())))
  .catch(error => dispatch(logoutFailure(error)));
};

const logoutRequest = () => ({
  type: actions.USER_LOGOUT_SUCCESS
});

const logoutSuccess = () => ({
  type: actions.USER_LOGOUT_SUCCESS,
});

const logoutFailure = (error) => ({
  type: actions.USER_LOGOUT_SUCCESS,
  error
});

export const loginFacebookRequest = () => ({
  type: actions.USER_FACEBOOK_LOGIN_REQUEST
});

export const loginRequest = () => ({
  type: actions.USER_SIGNIN_REQUEST
});

const showSignInForm = () => ({
  type: actions.SHOW_SIGNIN_FORM
});

const showSignUpForm = () => ({
  type: actions.SHOW_SIGNUP_FORM
});

const newStep = (step) => ({
  type: actions.NEW_STEP,
  step
});

export const goTo = (step) => dispatch => {
  dispatch(newStep(step));
  switch (step) {
  case 1 :
    return dispatch(showSignInForm());
  case 2 :
    return dispatch(showSignUpForm());
  default :
    return dispatch(showSignInForm());
  }
};
