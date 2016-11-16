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
const signInSuccess = (user) => ({type: actions.FETCH_SIGNIN_SUCCESS, user});
const signInFailure = (error) => ({type: actions.FETCH_SIGNIN_FAILURE, error});

export const fetchSignIn = (formData) => dispatch => {
  dispatch(signInRequest());
  fetch(`${base}/auth/local`, getInit('POST', formData))
    .then(handleResp)
    .then(({user}) => dispatch(signInSuccess(user)))
    .catch(() => dispatch(signInFailure('Email and/or password combination incorrect.')));
};

// Sign In - Facebook

const signInFacebookRequest = () => ({type: actions.FETCH_SIGNIN_FACEBOOK_REQUEST});
const signInFacebookSuccess = user => ({type: actions.FETCH_SIGNIN_FACEBOOK_SUCCESS, user});
const signInFacebookFailure = error => ({type: actions.FETCH_SIGNIN_FACEBOOK_FAILURE, error});

export const fetchSignInFacebook = () => dispatch => {
  dispatch(signInFacebookRequest());
  window.open(
    `${base}/auth/facebook`,
    'Continue with Facebook',
    'menubar=0,resizable=0,width=500,height=500,top=200,left=500'
  );
};

export const facebookCallback = (err, data) => dispatch => {
  if (err) {
    signInFacebookFailure(err);
    return;
  }
  try {
    dispatch(signInFacebookSuccess(JSON.parse(data)));
  } catch (err) {
    dispatch(signInFacebookFailure(err));
    return;
  }
};

// Sign Up Actions

const signUpRequest = () => ({type: actions.FETCH_SIGNUP_REQUEST});
const signUpSuccess = user => ({type: actions.FETCH_SIGNUP_SUCCESS, user});
const signUpFailure = error => ({type: actions.FETCH_SIGNUP_FAILURE, error});

export const fetchSignUp = formData => dispatch => {
  dispatch(signUpRequest());
  fetch(`${base}/user`, getInit('POST', formData))
    .then(handleResp)
    .then(({user}) => signUpSuccess(user))
    .catch((error) => signUpFailure(error));
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

// LogOut Actions

const logOutRequest = () => ({type: actions.LOGOUT_REQUEST});
const logOutSuccess = () => ({type: actions.LOGOUT_SUCCESS});
const logOutFailure = () => ({type: actions.LOGOUT_FAILURE});

export const logout = () => dispatch => {
  dispatch(logOutRequest());
  fetch(`${base}/auth`, getInit('DELETE'))
    .then(handleResp)
    .then(() => dispatch(logOutSuccess()))
    .catch(error => dispatch(logOutFailure(error)));
};

// Availability Checks Actions

const availabilityRequest = () => ({type: actions.FETCH_AVAILABILITY_REQUEST});
const availabilitySuccess = () => ({type: actions.FETCH_AVAILABILITY_SUCCESS});
const availabilityFailure = () => ({type: actions.FETCH_AVAILABILITY_FAILURE});

const availableField = field => ({type: actions.AVAILABLE_FIELD, field});
const unavailableField = field => ({type: actions.UNAVAILABLE_FIELD, field});

export const fetchCheckAvailability = formData => dispatch => {
  dispatch(availabilityRequest());
  fetch(`${base}/user/availability`, getInit('POST', formData))
    .then(handleResp)
    .then(({status}) => {
      const [field] = Object.keys(formData);
      dispatch(availabilitySuccess());
      if (status === 'available') {
        return dispatch(availableField(field));
      }
      return dispatch(unavailableField(field));
    })
    .catch((error) => availabilityFailure(error));
};

