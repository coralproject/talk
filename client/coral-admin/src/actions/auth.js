import * as actions from '../constants/auth';
import {base, handleResp, getInit} from '../helpers/response';

// Check Login

const checkLoginRequest = () => ({type: actions.CHECK_LOGIN_REQUEST});
const checkLoginSuccess = (user, isAdmin) => ({type: actions.CHECK_LOGIN_SUCCESS, user, isAdmin});
const checkLoginFailure = error => ({type: actions.CHECK_LOGIN_FAILURE, error});

export const checkLogin = () => dispatch => {
  dispatch(checkLoginRequest());
  fetch(`${base}/auth`, getInit('GET'))
    .then(handleResp)
    .then(user => {
      const isAdmin = !!user.roles.filter(i => i === 'admin').length;
      dispatch(checkLoginSuccess(user, isAdmin));
    })
    .catch(error => dispatch(checkLoginFailure(error)));
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
