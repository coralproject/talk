import * as actions from '../constants/auth';
import coralApi from '../../../coral-framework/helpers/response';

// Check Login

const checkLoginRequest = () => ({type: actions.CHECK_LOGIN_REQUEST});
const checkLoginSuccess = (user, isAdmin) => ({type: actions.CHECK_LOGIN_SUCCESS, user, isAdmin});
const checkLoginFailure = error => ({type: actions.CHECK_LOGIN_FAILURE, error});

export const checkLogin = () => dispatch => {
  dispatch(checkLoginRequest());
  coralApi('/auth')
    .then(result => {
      if (result.csrfToken !== null) {
        dispatch(check_csrf(result.csrfToken));
      }

      const isAdmin = !!result.user.roles.filter(i => i === 'admin').length;
      dispatch(checkLoginSuccess(result.user, isAdmin));
    })
    .catch(error => dispatch(checkLoginFailure(error)));
};

// Set CSRF Token
export const check_csrf = (_csrf) => ({type: actions.CHECK_CSRF_TOKEN, _csrf});

// LogOut Actions

const logOutRequest = () => ({type: actions.LOGOUT_REQUEST});
const logOutSuccess = () => ({type: actions.LOGOUT_SUCCESS});
const logOutFailure = () => ({type: actions.LOGOUT_FAILURE});

export const logout = () => dispatch => {
  dispatch(logOutRequest());
  coralApi('/auth', {method: 'DELETE'})
    .then(() => dispatch(logOutSuccess()))
    .catch(error => dispatch(logOutFailure(error)));
};
