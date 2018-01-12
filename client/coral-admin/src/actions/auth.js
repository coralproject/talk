import bowser from 'bowser';
import * as actions from '../constants/auth';
import t from 'coral-framework/services/i18n';
import jwtDecode from 'jwt-decode';

//==============================================================================
// SIGN IN
//==============================================================================

export const handleLogin = (email, password, recaptchaResponse) => (
  dispatch,
  _,
  { rest, client, storage }
) => {
  dispatch({ type: actions.LOGIN_REQUEST });

  const params = {
    method: 'POST',
    body: {
      email,
      password,
    },
  };

  if (recaptchaResponse) {
    params.headers = {
      'X-Recaptcha-Response': recaptchaResponse,
    };
  }

  return rest('/auth/local', params)
    .then(({ user, token }) => {
      if (!user) {
        if (!bowser.safari && !bowser.ios && storage) {
          storage.removeItem('token');
        }
        return dispatch(checkLoginFailure('not logged in'));
      }

      dispatch(handleAuthToken(token));
      client.resetWebsocket();
      dispatch(checkLoginSuccess(user));
    })
    .catch(error => {
      console.error(error);
      const errorMessage = error.translation_key
        ? t(`error.${error.translation_key}`)
        : error.toString();

      if (error.translation_key === 'NOT_AUTHORIZED') {
        // invalid credentials
        dispatch({
          type: actions.LOGIN_FAILURE,
          message: t('error.email_password'),
        });
      } else if (error.translation_key === 'LOGIN_MAXIMUM_EXCEEDED') {
        dispatch({
          type: actions.LOGIN_MAXIMUM_EXCEEDED,
          message: t(`error.${error.translation_key}`),
        });
      } else {
        dispatch({
          type: actions.LOGIN_FAILURE,
          message: errorMessage,
        });
      }
    });
};

//==============================================================================
// FORGOT PASSWORD
//==============================================================================

const forgotPasswordRequest = () => ({
  type: actions.FETCH_FORGOT_PASSWORD_REQUEST,
});

const forgotPasswordSuccess = () => ({
  type: actions.FETCH_FORGOT_PASSWORD_SUCCESS,
});

const forgotPasswordFailure = error => ({
  type: actions.FETCH_FORGOT_PASSWORD_FAILURE,
  error,
});

export const requestPasswordReset = email => (dispatch, _, { rest }) => {
  dispatch(forgotPasswordRequest(email));
  const redirectUri = location.href;

  return rest('/account/password/reset', {
    method: 'POST',
    body: { email, loc: redirectUri },
  })
    .then(() => dispatch(forgotPasswordSuccess()))
    .catch(error => {
      console.error(error);
      const errorMessage = error.translation_key
        ? t(`error.${error.translation_key}`)
        : error.toString();
      dispatch(forgotPasswordFailure(errorMessage));
    });
};

//==============================================================================
// CHECK LOGIN
//==============================================================================

const checkLoginRequest = () => ({
  type: actions.CHECK_LOGIN_REQUEST,
});

const checkLoginSuccess = (user, isAdmin) => ({
  type: actions.CHECK_LOGIN_SUCCESS,
  user,
  isAdmin,
});

const checkLoginFailure = error => ({
  type: actions.CHECK_LOGIN_FAILURE,
  error,
});

export const checkLogin = () => (dispatch, _, { rest, client, storage }) => {
  dispatch(checkLoginRequest());
  return rest('/auth')
    .then(({ user }) => {
      if (!user) {
        if (!bowser.safari && !bowser.ios && storage) {
          storage.removeItem('token');
        }
        return dispatch(checkLoginFailure('not logged in'));
      }

      client.resetWebsocket();
      dispatch(checkLoginSuccess(user));
    })
    .catch(error => {
      console.error(error);
      const errorMessage = error.translation_key
        ? t(`error.${error.translation_key}`)
        : error.toString();
      dispatch(checkLoginFailure(errorMessage));
    });
};

//==============================================================================
// LOGOUT
//==============================================================================

export const logout = () => (dispatch, _, { rest, client, storage }) => {
  return rest('/auth', { method: 'DELETE' }).then(() => {
    if (storage) {
      storage.removeItem('token');
    }

    // Reset the websocket.
    client.resetWebsocket();

    dispatch({ type: actions.LOGOUT });
  });
};

//==============================================================================
// AUTH TOKEN
//==============================================================================

export const handleAuthToken = token => (dispatch, _, { storage }) => {
  if (storage) {
    storage.setItem('exp', jwtDecode(token).exp);
    storage.setItem('token', token);
  }
  dispatch({ type: 'HANDLE_AUTH_TOKEN' });
};
