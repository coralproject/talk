import * as actions from '../constants/auth';
import coralApi from 'coral-framework/helpers/response';
import * as Storage from 'coral-framework/helpers/storage';
import {handleAuthToken} from 'coral-framework/actions/auth';

//==============================================================================
// SIGN IN
//==============================================================================

export const handleLogin = (email, password, recaptchaResponse) => (dispatch) => {
  dispatch({type: actions.LOGIN_REQUEST});
  const params = {method: 'POST', body: {email, password}};
  if (recaptchaResponse) {
    params.headers = {'X-Recaptcha-Response': recaptchaResponse};
  }
  return coralApi('/auth/local', params)
    .then(({user, token}) => {
      if (!user) {
        Storage.removeItem('token');
        return dispatch(checkLoginFailure('not logged in'));
      }
      dispatch(handleAuthToken(token));
      dispatch(checkLoginSuccess(user));
    })
    .catch((error) => {
      if (error.translation_key === 'LOGIN_MAXIMUM_EXCEEDED') {
        dispatch({
          type: actions.LOGIN_MAXIMUM_EXCEEDED,
          message: error.translation_key
        });
      } else {
        dispatch({type: actions.LOGIN_FAILURE, message: error.translation_key});
      }
    });
};

//==============================================================================
// FORGOT PASSWORD
//==============================================================================

const forgotPassowordRequest = () => ({
  type: actions.FETCH_FORGOT_PASSWORD_REQUEST
});

const forgotPassowordSuccess = () => ({
  type: actions.FETCH_FORGOT_PASSWORD_SUCCESS
});

const forgotPassowordFailure = () => ({
  type: actions.FETCH_FORGOT_PASSWORD_FAILURE
});

export const requestPasswordReset = (email) => (dispatch) => {
  dispatch(forgotPassowordRequest(email));
  const redirectUri = location.href;

  return coralApi('/account/password/reset', {method: 'POST', body: {email,  loc: redirectUri}})
    .then(() => dispatch(forgotPassowordSuccess()))
    .catch((error) => dispatch(forgotPassowordFailure(error)));
};

//==============================================================================
// CHECK LOGIN
//==============================================================================

const checkLoginRequest = () => ({
  type: actions.CHECK_LOGIN_REQUEST
});

const checkLoginSuccess = (user, isAdmin) => ({
  type: actions.CHECK_LOGIN_SUCCESS,
  user,
  isAdmin
});

const checkLoginFailure = (error) => ({
  type: actions.CHECK_LOGIN_FAILURE,
  error
});

export const checkLogin = () => (dispatch) => {
  dispatch(checkLoginRequest());
  return coralApi('/auth')
    .then(({user}) => {
      if (!user) {
        Storage.removeItem('token');
        return dispatch(checkLoginFailure('not logged in'));
      }

      dispatch(checkLoginSuccess(user));
    })
    .catch((error) => {
      console.error(error);
      dispatch(checkLoginFailure(`${error.translation_key}`));
    });
};
