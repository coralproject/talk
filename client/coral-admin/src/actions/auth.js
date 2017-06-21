import bowser from 'bowser';
import * as actions from '../constants/auth';
import coralApi from 'coral-framework/helpers/request';
import * as Storage from 'coral-framework/helpers/storage';
import {handleAuthToken} from 'coral-framework/actions/auth';
import {resetWebsocket} from 'coral-framework/services/client';
import t from 'coral-framework/services/i18n';

//==============================================================================
// SIGN IN
//==============================================================================

export const handleLogin = (email, password, recaptchaResponse) => (dispatch) => {
  dispatch({type: actions.LOGIN_REQUEST});

  const params = {
    method: 'POST',
    body: {
      email,
      password
    }
  };

  if (recaptchaResponse) {
    params.headers = {
      'X-Recaptcha-Response': recaptchaResponse
    };
  }

  return coralApi('/auth/local', params)
    .then(({user, token}) => {

      if (!user) {
        if (!bowser.safari && !bowser.ios) {
          Storage.removeItem('token');
        }
        return dispatch(checkLoginFailure('not logged in'));
      }

      dispatch(handleAuthToken(token));
      resetWebsocket();
      dispatch(checkLoginSuccess(user));
    })
    .catch((error) => {
      console.error(error);
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

const forgotPasswordRequest = () => ({
  type: actions.FETCH_FORGOT_PASSWORD_REQUEST
});

const forgotPasswordSuccess = () => ({
  type: actions.FETCH_FORGOT_PASSWORD_SUCCESS
});

const forgotPasswordFailure = (error) => ({
  type: actions.FETCH_FORGOT_PASSWORD_FAILURE,
  error,
});

export const requestPasswordReset = (email) => (dispatch) => {
  dispatch(forgotPasswordRequest(email));
  const redirectUri = location.href;

  return coralApi('/account/password/reset', {method: 'POST', body: {email,  loc: redirectUri}})
    .then(() => dispatch(forgotPasswordSuccess()))
    .catch((error) => {
      console.error(error);
      const errorMessage = error.translation_key ? t(`error.${error.translation_key}`) : error.toString();
      dispatch(forgotPasswordFailure(errorMessage));
    });
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
        if (!bowser.safari && !bowser.ios) {
          Storage.removeItem('token');
        }
        return dispatch(checkLoginFailure('not logged in'));
      }

      resetWebsocket();
      dispatch(checkLoginSuccess(user));
    })
    .catch((error) => {
      console.error(error);
      const errorMessage = error.translation_key ? t(`error.${error.translation_key}`) : error.toString();
      dispatch(checkLoginFailure(errorMessage));
    });
};
