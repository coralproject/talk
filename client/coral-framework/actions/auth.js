import jwtDecode from 'jwt-decode';
import bowser from 'bowser';
import * as actions from '../constants/auth';
import * as Storage from '../helpers/storage';
import coralApi, {base} from '../helpers/request';

import t from 'coral-framework/services/i18n';

export const showSignInDialog = () => (dispatch, getState) => {
  const signInPopUp = window.open(
    '/embed/stream/login',
    'Login',
    'menubar=0,resizable=0,width=500,height=550,top=200,left=500'
  );

  // Workaround odd behavior in older WebKit versions, where
  // onunload is called twice. (Encountered in IOS 8.3)
  let loaded = false;
  signInPopUp.onload = () => {
    loaded = true;

    // Fire some actions inside the popups reducer, to initialize required state.
    const required = getState().asset.toJS().settings.requireEmailConfirmation;
    const redirectUri = getState().auth.toJS().redirectUri;
    signInPopUp.coralStore.dispatch(setRequireEmailVerification(required));
    signInPopUp.coralStore.dispatch(setRedirectUri(redirectUri));
  };

  // Use `onunload` instead of `onbeforeunload` which is not supported in IOS Safari.
  signInPopUp.onunload = () => {
    if (loaded) {
      dispatch(checkLogin());
    }
  };

  dispatch({type: actions.SHOW_SIGNIN_DIALOG});
};
export const hideSignInDialog = () => (dispatch) => {
  dispatch({type: actions.HIDE_SIGNIN_DIALOG});
  window.close();
};

export const createUsernameRequest = () => ({
  type: actions.CREATE_USERNAME_REQUEST
});
export const showCreateUsernameDialog = () => ({
  type: actions.SHOW_CREATEUSERNAME_DIALOG
});
export const hideCreateUsernameDialog = () => ({
  type: actions.HIDE_CREATEUSERNAME_DIALOG
});

const createUsernameSuccess = () => ({
  type: actions.CREATE_USERNAME_SUCCESS
});

const createUsernameFailure = (error) => ({
  type: actions.CREATE_USERNAME_FAILURE,
  error
});

export const updateUsername = ({username}) => ({
  type: actions.UPDATE_USERNAME,
  username
});

export const createUsername = (userId, formData) => (dispatch) => {
  dispatch(createUsernameRequest());
  coralApi('/account/username', {method: 'PUT', body: formData})
    .then(() => {
      dispatch(createUsernameSuccess());
      dispatch(hideCreateUsernameDialog());
      dispatch(updateUsername(formData));
    })
    .catch((error) => {
      dispatch(createUsernameFailure(t(`error.${error.translation_key}`)));
    });
};

export const changeView = (view) => (dispatch) => {
  dispatch({
    type: actions.CHANGE_VIEW,
    view
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
  type: actions.CLEAN_STATE
});

// Sign In Actions

const signInRequest = () => ({
  type: actions.FETCH_SIGNIN_REQUEST
});

const signInFailure = (error) => ({
  type: actions.FETCH_SIGNIN_FAILURE,
  error
});

//==============================================================================
// AUTH TOKEN
//==============================================================================

export const handleAuthToken = (token) => (dispatch) => {
  Storage.setItem('exp', jwtDecode(token).exp);
  Storage.setItem('token', token);
  dispatch({type: 'HANDLE_AUTH_TOKEN'});
};

//==============================================================================
// SIGN IN
//==============================================================================

export const fetchSignIn = (formData) => {
  return (dispatch) => {
    dispatch(signInRequest());

    return coralApi('/auth/local', {method: 'POST', body: formData})
      .then(({token}) => {
        if (!bowser.safari && !bowser.ios) {
          dispatch(handleAuthToken(token));
        }
        dispatch(hideSignInDialog());
      })
      .catch((error) => {
        if (error.metadata) {

          // the user might not have a valid email. prompt the user user re-request the confirmation email
          dispatch(
            signInFailure(t('error.email_not_verified', error.metadata))
          );
        } else {

          // invalid credentials
          dispatch(signInFailure(t('error.email_password')));
        }
      });
  };
};

//==============================================================================
// SIGN IN - FACEBOOK
//==============================================================================

const signInFacebookRequest = () => ({
  type: actions.FETCH_SIGNIN_FACEBOOK_REQUEST
});

const signInFacebookSuccess = (user) => ({
  type: actions.FETCH_SIGNIN_FACEBOOK_SUCCESS,
  user
});

const signInFacebookFailure = (error) => ({
  type: actions.FETCH_SIGNIN_FACEBOOK_FAILURE,
  error
});

export const fetchSignInFacebook = () => (dispatch) => {
  dispatch(signInFacebookRequest());
  window.open(
    `${base}/auth/facebook`,
    'Continue with Facebook',
    'menubar=0,resizable=0,width=500,height=500,top=200,left=500'
  );
};

//==============================================================================
// SIGN UP - FACEBOOK
//==============================================================================

const signUpFacebookRequest = () => ({
  type: actions.FETCH_SIGNUP_FACEBOOK_REQUEST
});

export const fetchSignUpFacebook = () => (dispatch) => {
  dispatch(signUpFacebookRequest());
  window.open(
    `${base}/auth/facebook`,
    'Continue with Facebook',
    'menubar=0,resizable=0,width=500,height=500,top=200,left=500'
  );
};

export const facebookCallback = (err, data) => (dispatch) => {
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

const signUpRequest = () => ({type: actions.FETCH_SIGNUP_REQUEST});
const signUpSuccess = (user) => ({type: actions.FETCH_SIGNUP_SUCCESS, user});
const signUpFailure = (error) => ({type: actions.FETCH_SIGNUP_FAILURE, error});

export const fetchSignUp = (formData) => (dispatch, getState) => {
  const redirectUri = getState().auth.toJS().redirectUri;
  dispatch(signUpRequest());

  coralApi('/users', {
    method: 'POST',
    body: formData,
    headers: {'X-Pym-Url': redirectUri}
  })
    .then(({user}) => {
      dispatch(signUpSuccess(user));
    })
    .catch((error) => {
      let errorMessage = t(`error.${error.message}`);

      // if there is no translation defined, just show the error string
      if (errorMessage === `error.${error.message}`) {
        errorMessage = error.message;
      }
      dispatch(signUpFailure(errorMessage));
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

const forgotPasswordFailure = () => ({
  type: actions.FETCH_FORGOT_PASSWORD_FAILURE
});

export const fetchForgotPassword = (email) => (dispatch, getState) => {
  dispatch(forgotPasswordRequest(email));
  const redirectUri = getState().auth.toJS().redirectUri;
  coralApi('/account/password/reset', {
    method: 'POST',
    body: {email, loc: redirectUri}
  })
    .then(() => dispatch(forgotPasswordSuccess()))
    .catch((error) => dispatch(forgotPasswordFailure(error)));
};

//==============================================================================
// LOGOUT
//==============================================================================

export const logout = () => (dispatch) => {
  return coralApi('/auth', {method: 'DELETE'}).then(() => {
    if (!bowser.safari && !bowser.ios) {
      Storage.removeItem('token');
    }
    dispatch({type: actions.LOGOUT});
  });
};

//==============================================================================
// CHECK LOGIN
//==============================================================================

const checkLoginRequest = () => ({type: actions.CHECK_LOGIN_REQUEST});
const checkLoginFailure = (error) => ({type: actions.CHECK_LOGIN_FAILURE, error});

const checkLoginSuccess = (user, isAdmin) => ({
  type: actions.CHECK_LOGIN_SUCCESS,
  user,
  isAdmin
});

export const checkLogin = () => (dispatch) => {
  dispatch(checkLoginRequest());
  coralApi('/auth')
    .then((result) => {
      if (!result.user) {
        if (!bowser.safari && !bowser.ios) {
          Storage.removeItem('token');
        }
        throw new Error('Not logged in');
      }

      dispatch(checkLoginSuccess(result.user));

      // Display create username dialog if necessary.
      if (result.user.canEditName && result.user.status !== 'BANNED') {
        dispatch(showCreateUsernameDialog());
      }
    })
    .catch((error) => {
      console.error(error);
      dispatch(checkLoginFailure(`${error.translation_key}`));
    });
};

export const validForm = () => ({type: actions.VALID_FORM});
export const invalidForm = (error) => ({type: actions.INVALID_FORM, error});

//==============================================================================
// VERIFY EMAIL
//==============================================================================

const verifyEmailRequest = () => ({
  type: actions.VERIFY_EMAIL_REQUEST
});

const verifyEmailSuccess = () => ({
  type: actions.VERIFY_EMAIL_SUCCESS
});

const verifyEmailFailure = () => ({
  type: actions.VERIFY_EMAIL_FAILURE
});

export const requestConfirmEmail = (email) => (dispatch, getState) => {
  const redirectUri = getState().auth.toJS().redirectUri;
  dispatch(verifyEmailRequest());
  return coralApi('/users/resend-verify', {
    method: 'POST',
    body: {email},
    headers: {'X-Pym-Url': redirectUri}
  })
    .then(() => {
      dispatch(verifyEmailSuccess());
    })
    .catch((err) => {

      // email might have already been verifyed
      dispatch(verifyEmailFailure(err));
      throw err;
    });
};

// Login Popup actions.
export const setRequireEmailVerification = (required) => ({
  type: actions.SET_REQUIRE_EMAIL_VERIFICATION,
  required,
});

export const setRedirectUri = (uri) => ({
  type: actions.SET_REDIRECT_URI,
  uri,
});
