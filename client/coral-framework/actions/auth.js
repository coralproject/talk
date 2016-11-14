import * as actions from '../constants/auth';
import {base, handleResp, getInit} from '../helpers/response';

// Dialog Actions
export const showSignInDialog = () => ({type: actions.SHOW_SIGNIN_DIALOG});
export const hideSignInDialog = () => ({type: actions.HIDE_SIGNIN_DIALOG});

export const changeView = view => dispatch =>
  dispatch({
    type: actions.CHANGE_VIEW,
    view
  });

export const cleanState = () => ({type: actions.CLEAN_STATE});

// Sign In Actions

const signInRequest = () => ({type: actions.FETCH_SIGNIN_REQUEST});
const signInSuccess = () => ({type: actions.FETCH_SIGNIN_SUCCESS});
const signInFailure = () => ({type: actions.FETCH_SIGNIN_FAILURE});

export const fetchSignIn = () => dispatch => {
  dispatch(signInRequest());
  fetch(`${base}/auth`, getInit('POST'))
    .then(handleResp)
    .then(() => dispatch(signInSuccess()))
    .catch(error => dispatch(signInFailure(error)));
};

// Sign In - Facebook

const signInFacebookRequest = () => ({type: actions.FETCH_SIGNIN_FACEBOOK_REQUEST});
//const signInFacebookSuccess = () => ({type: actions.FETCH_SIGNIN_FACEBOOK_SUCCESS});
//const signInFacebookFailure = () => ({type: actions.FETCH_SIGNIN_FACEBOOK_FAILURE});

export const fetchSignInFacebook = () => dispatch => {
  dispatch(signInFacebookRequest());
  window.open(
    `${base}/auth/facebook`,
    'Continue with Facebook',
    'menubar=0,resizable=0,width=500,height=500,top=200,left=500'
  );
};

// Sign Up Actions

const signUpRequest = () => ({type: actions.FETCH_SIGNUP_REQUEST});
const signUpSuccess = () => ({type: actions.FETCH_SIGNUP_SUCCESS});
const signUpFailure = () => ({type: actions.FETCH_SIGNUP_FAILURE});

export const fetchSignUp = () => dispatch => {
  dispatch(signUpRequest());
  fetch(`${base}/auth`, getInit('POST'))
    .then(handleResp)
    .then(() => dispatch(signUpSuccess()))
    .catch(error => dispatch(signUpFailure(error)));
};

// Forgot Password Actions

const forgotPassowordRequest = () => ({type: actions.FETCH_FORGOT_PASSWORD_REQUEST});
const forgotPassowordSuccess = () => ({type: actions.FETCH_FORGOT_PASSWORD_SUCCESS});
const forgotPassowordFailure = () => ({type: actions.FETCH_FORGOT_PASSWORD_FAILURE});

export const fetchForgotPassword = () => dispatch => {
  dispatch(forgotPassowordRequest());
  fetch(`${base}/forgot`, getInit('POST'))
    .then(handleResp)
    .then(() => dispatch(forgotPassowordSuccess()))
    .catch(error => dispatch(forgotPassowordFailure(error)));
};

// LogOut

export const logout = () => dispatch => {
  dispatch(signInRequest());
  fetch(`${base}/auth`, getInit('DELETE'))
    .then(handleResp)
    .then(() => dispatch(signInSuccess()))
    .catch(error => dispatch(signInFailure(error)));
};

