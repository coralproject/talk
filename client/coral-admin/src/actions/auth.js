import * as actions from '../constants/auth';
import coralApi from 'coral-framework/helpers/response';

// Log In.
export const handleLogin = (email, password, recaptchaResponse) => dispatch => {
  dispatch({type: actions.LOGIN_REQUEST});
  const params = {method: 'POST', body: {email, password}};
  if (recaptchaResponse) {
    params.headers = {'X-Recaptcha-Response': recaptchaResponse};
  }
  return coralApi('/auth/local', params)
    .then(({user}) => {
      if (!user) {
        return dispatch(checkLoginFailure('not logged in'));
      }

      const isAdmin = !!user.roles.filter(i => i === 'ADMIN').length;
      dispatch(checkLoginSuccess(user, isAdmin));
    })
    .catch(error => {

      if (error.translation_key === 'login_maximum_exceeded') {
        dispatch({type: actions.LOGIN_MAXIMUM_EXCEEDED, message: error.translation_key});
      } else {
        dispatch({type: actions.LOGIN_FAILURE, message: error.translation_key});
      }
    });
};

const forgotPassowordRequest = () => ({type: actions.FETCH_FORGOT_PASSWORD_REQUEST});
const forgotPassowordSuccess = () => ({type: actions.FETCH_FORGOT_PASSWORD_SUCCESS});
const forgotPassowordFailure = () => ({type: actions.FETCH_FORGOT_PASSWORD_FAILURE});

export const requestPasswordReset = email => dispatch => {
  dispatch(forgotPassowordRequest(email));
  return coralApi('/account/password/reset', {method: 'POST', body: {email}})
    .then(() => dispatch(forgotPassowordSuccess()))
    .catch(error => dispatch(forgotPassowordFailure(error)));
};

// Check Login

const checkLoginRequest = () => ({type: actions.CHECK_LOGIN_REQUEST});
const checkLoginSuccess = (user, isAdmin) => ({type: actions.CHECK_LOGIN_SUCCESS, user, isAdmin});
const checkLoginFailure = error => ({type: actions.CHECK_LOGIN_FAILURE, error});

export const checkLogin = () => dispatch => {
  dispatch(checkLoginRequest());
  return coralApi('/auth')
    .then(({user}) => {
      if (!user) {
        return dispatch(checkLoginFailure('not logged in'));
      }

      const isAdmin = !!user.roles.filter(i => i === 'ADMIN').length;
      dispatch(checkLoginSuccess(user, isAdmin));
    })
    .catch(error => {
      console.error(error);
      dispatch(checkLoginFailure(`${error.translation_key}`));
    });
};

// LogOut Actions

const logOutRequest = () => ({type: actions.LOGOUT_REQUEST});
const logOutSuccess = () => ({type: actions.LOGOUT_SUCCESS});
const logOutFailure = () => ({type: actions.LOGOUT_FAILURE});

export const logout = () => dispatch => {
  dispatch(logOutRequest());
  return coralApi('/auth', {method: 'DELETE'})
    .then(() => dispatch(logOutSuccess()))
    .catch(error => dispatch(logOutFailure(error)));
};
