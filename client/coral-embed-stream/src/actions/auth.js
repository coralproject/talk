import jwtDecode from 'jwt-decode';
import bowser from 'bowser';
import * as actions from '../constants/auth';
import { notify } from 'coral-framework/actions/notification';
import t from 'coral-framework/services/i18n';
import get from 'lodash/get';

export const updateStatus = status => ({
  type: actions.UPDATE_STATUS,
  status,
});

export const showSignInDialog = () => ({
  type: actions.SHOW_SIGNIN_DIALOG,
});

export const hideSignInDialog = () => dispatch => {
  if (window.opener && window.opener !== window) {
    // TODO: We need to address this when we refactor the
    // login popup out of the embed.

    // we are in a popup
    window.close();
  } else {
    dispatch(checkLogin());
  }
  dispatch({ type: actions.HIDE_SIGNIN_DIALOG });
};

export const resetSignInDialog = () => dispatch => {
  dispatch({ type: actions.HIDE_SIGNIN_DIALOG });
};

export const focusSignInDialog = () => ({
  type: actions.FOCUS_SIGNIN_DIALOG,
});

export const blurSignInDialog = () => ({
  type: actions.BLUR_SIGNIN_DIALOG,
});

export const showCreateUsernameDialog = () => ({
  type: actions.SHOW_CREATEUSERNAME_DIALOG,
});

export const hideCreateUsernameDialog = () => ({
  type: actions.HIDE_CREATEUSERNAME_DIALOG,
});

export const updateUsername = username => ({
  type: actions.UPDATE_USERNAME,
  username,
});

export const changeView = view => dispatch => {
  dispatch({
    type: actions.CHANGE_VIEW,
    view,
  });

  switch (view) {
    case 'SIGNUP':
      window.resizeTo(500, 800);
      break;
    case 'FORGOT':
      window.resizeTo(500, 400);
      break;
    default:
      window.resizeTo(500, 550);
  }
};

export const cleanState = () => ({
  type: actions.CLEAN_STATE,
});

// Sign In Actions

const signInRequest = email => ({
  type: actions.FETCH_SIGNIN_REQUEST,
  email,
});

const signInFailure = error => ({
  type: actions.FETCH_SIGNIN_FAILURE,
  error,
});

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

//==============================================================================
// SIGN IN
//==============================================================================

export const fetchSignIn = formData => {
  return (dispatch, _, { rest }) => {
    dispatch(signInRequest(formData.email));

    return rest('/auth/local', { method: 'POST', body: formData })
      .then(({ token }) => {
        if (!bowser.safari && !bowser.ios) {
          dispatch(handleAuthToken(token));
        }
        dispatch(hideSignInDialog());
      })
      .catch(error => {
        console.error(error);
        if (error.metadata) {
          // the user might not have a valid email. prompt the user user re-request the confirmation email
          dispatch(
            signInFailure(t('error.email_not_verified', error.metadata))
          );
        } else if (error.translation_key === 'NOT_AUTHORIZED') {
          // invalid credentials
          dispatch(signInFailure(t('error.email_password'), error.metadata));
        } else {
          dispatch(signInFailure(error));
        }
      });
  };
};

//==============================================================================
// SIGN IN - FACEBOOK
//==============================================================================

const signInFacebookRequest = () => ({
  type: actions.FETCH_SIGNIN_FACEBOOK_REQUEST,
});

const signInFacebookSuccess = user => ({
  type: actions.FETCH_SIGNIN_FACEBOOK_SUCCESS,
  user,
});

const signInFacebookFailure = error => ({
  type: actions.FETCH_SIGNIN_FACEBOOK_FAILURE,
  error,
});

export const fetchSignInFacebook = () => (dispatch, _, { rest }) => {
  dispatch(signInFacebookRequest());
  window.open(
    `${rest.uri}/auth/facebook`,
    'Continue with Facebook',
    'menubar=0,resizable=0,width=500,height=500,top=200,left=500'
  );
};

//==============================================================================
// SIGN UP - FACEBOOK
//==============================================================================

const signUpFacebookRequest = () => ({
  type: actions.FETCH_SIGNUP_FACEBOOK_REQUEST,
});

export const fetchSignUpFacebook = () => (dispatch, _, { rest }) => {
  dispatch(signUpFacebookRequest());
  window.open(
    `${rest.uri}/auth/facebook`,
    'Continue with Facebook',
    'menubar=0,resizable=0,width=500,height=500,top=200,left=500'
  );
};

export const facebookCallback = (err, data) => dispatch => {
  if (err) {
    dispatch(signInFacebookFailure(err));
    return;
  }
  try {
    dispatch(handleAuthToken(data.token));
    dispatch(signInFacebookSuccess(data.user));
    dispatch(hideSignInDialog());
  } catch (err) {
    dispatch(signInFacebookFailure(err));
    return;
  }
};

//==============================================================================
// SIGN UP
//==============================================================================

const signUpRequest = () => ({ type: actions.FETCH_SIGNUP_REQUEST });
const signUpSuccess = user => ({ type: actions.FETCH_SIGNUP_SUCCESS, user });
const signUpFailure = error => ({ type: actions.FETCH_SIGNUP_FAILURE, error });

export const fetchSignUp = formData => (dispatch, getState, { rest }) => {
  const redirectUri = getState().auth.redirectUri;
  dispatch(signUpRequest());

  rest('/users', {
    method: 'POST',
    body: formData,
    headers: { 'X-Pym-Url': redirectUri },
  })
    .then(({ user }) => {
      dispatch(signUpSuccess(user));
    })
    .catch(error => {
      console.error(error);
      const errorMessage = error.translation_key
        ? t(`error.${error.translation_key}`)
        : error.toString();
      dispatch(signUpFailure(errorMessage));
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

export const fetchForgotPassword = email => (dispatch, getState, { rest }) => {
  dispatch(forgotPasswordRequest(email));
  const redirectUri = getState().auth.redirectUri;
  rest('/account/password/reset', {
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
// LOGOUT
//==============================================================================

export const logout = () => async (
  dispatch,
  _,
  { rest, client, pym, storage }
) => {
  await rest('/auth', { method: 'DELETE' });

  if (storage) {
    storage.removeItem('token');
  }

  // Reset the websocket.
  client.resetWebsocket();

  dispatch({ type: actions.LOGOUT });
  pym.sendMessage('coral-auth-changed');
};

//==============================================================================
// CHECK LOGIN
//==============================================================================

const checkLoginRequest = () => ({ type: actions.CHECK_LOGIN_REQUEST });
const checkLoginFailure = error => ({
  type: actions.CHECK_LOGIN_FAILURE,
  error,
});

const checkLoginSuccess = (user, isAdmin) => ({
  type: actions.CHECK_LOGIN_SUCCESS,
  user,
  isAdmin,
});

const ErrNotLoggedIn = new Error('Not logged in');

export const checkLogin = () => (
  dispatch,
  _,
  { rest, client, pym, storage }
) => {
  dispatch(checkLoginRequest());
  rest('/auth')
    .then(result => {
      if (!result.user) {
        if (storage) {
          storage.removeItem('token');
        }
        throw ErrNotLoggedIn;
      }

      // Reset the websocket.
      client.resetWebsocket();

      dispatch(checkLoginSuccess(result.user));
      pym.sendMessage('coral-auth-changed', JSON.stringify(result.user));

      // This is for login via social. Usernames should be set.
      if (
        get(result.user, 'status.username.status') === 'UNSET' &&
        !get(result.user, 'status.banned.status')
      ) {
        dispatch(showCreateUsernameDialog());
      }
    })
    .catch(error => {
      if (error !== ErrNotLoggedIn) {
        console.error(error);
      }
      if (error.status && error.status === 401 && storage) {
        // Unauthorized.
        storage.removeItem('token');
      }
      const errorMessage = error.translation_key
        ? t(`error.${error.translation_key}`)
        : error.toString();
      dispatch(checkLoginFailure(errorMessage));
    });
};

export const validForm = () => ({ type: actions.VALID_FORM });
export const invalidForm = error => ({ type: actions.INVALID_FORM, error });

//==============================================================================
// VERIFY EMAIL
//==============================================================================

const verifyEmailRequest = () => ({
  type: actions.VERIFY_EMAIL_REQUEST,
});

const verifyEmailSuccess = () => ({
  type: actions.VERIFY_EMAIL_SUCCESS,
});

const verifyEmailFailure = error => ({
  type: actions.VERIFY_EMAIL_FAILURE,
  error,
});

export const requestConfirmEmail = email => (dispatch, getState, { rest }) => {
  const redirectUri = getState().auth.redirectUri;
  dispatch(verifyEmailRequest());
  return rest('/users/resend-verify', {
    method: 'POST',
    body: { email },
    headers: { 'X-Pym-Url': redirectUri },
  })
    .then(() => {
      dispatch(verifyEmailSuccess());
    })
    .catch(error => {
      console.error(error);
      dispatch(verifyEmailFailure(error));
      throw error;
    });
};

// Login Popup actions.
export const setRequireEmailVerification = required => ({
  type: actions.SET_REQUIRE_EMAIL_VERIFICATION,
  required,
});

export const setRedirectUri = uri => ({
  type: actions.SET_REDIRECT_URI,
  uri,
});

//==============================================================================
// Edit Username
//==============================================================================

const editUsernameFailure = error => ({
  type: actions.EDIT_USERNAME_FAILURE,
  error,
});
const editUsernameSuccess = () => ({ type: actions.EDIT_USERNAME_SUCCESS });

export const editName = username => (dispatch, _, { rest }) => {
  return rest('/account/username', { method: 'PUT', body: { username } })
    .then(() => {
      dispatch(editUsernameSuccess());
      dispatch(notify('success', t('framework.success_name_update')));
    })
    .catch(error => {
      console.error(error);
      const errorMessage = error.translation_key
        ? t(`error.${error.translation_key}`)
        : error.toString();
      dispatch(editUsernameFailure(errorMessage));
    });
};
