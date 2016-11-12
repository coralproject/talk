import * as actions from '../constants/auth';
import {base, handleResp, getInit} from '../helpers';

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
