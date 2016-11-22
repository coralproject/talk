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
