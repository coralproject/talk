import {gql} from 'react-apollo';
import client from 'coral-framework/services/client';
import I18n from '../../coral-framework/modules/i18n/i18n';
import translations from './../translations';
const lang = new I18n(translations);
import * as actions from '../constants/auth';
import coralApi, {base} from '../helpers/response';
import {pym} from 'coral-framework';

const ME_QUERY = gql`
  query Me {
    me {
      status
    }
  }
`;

function fetchMe() {
  return client.query({
    fetchPolicy: 'network-only',
    query: ME_QUERY});
}

// Dialog Actions
export const showSignInDialog = () => dispatch => {
  const signInPopUp = window.open(
    '/embed/stream/login',
    'Login',
    'menubar=0,resizable=0,width=500,height=550,top=200,left=500'
  );

  signInPopUp.onbeforeunload = () => {
    dispatch(checkLogin());
    fetchMe();
  };
  dispatch({type: actions.SHOW_SIGNIN_DIALOG});
};
export const hideSignInDialog = () => dispatch => {
  dispatch({type: actions.HIDE_SIGNIN_DIALOG});
  window.close();
};

export const createUsernameRequest = () => ({type: actions.CREATE_USERNAME_REQUEST});
export const showCreateUsernameDialog = () => ({type: actions.SHOW_CREATEUSERNAME_DIALOG});
export const hideCreateUsernameDialog = () => ({type: actions.HIDE_CREATEUSERNAME_DIALOG});

const createUsernameSuccess = () => ({type: actions.CREATE_USERNAME_SUCCESS});
const createUsernameFailure = error => ({type: actions.CREATE_USERNAME_FAILURE, error});

export const updateUsername = ({username}) => ({type: actions.UPDATE_USERNAME, username});

export const createUsername = (userId, formData) => dispatch => {
  dispatch(createUsernameRequest());
  coralApi('/account/username', {method: 'PUT', body: formData})
    .then(() => {
      dispatch(createUsernameSuccess());
      dispatch(hideCreateUsernameDialog());
      dispatch(updateUsername(formData));
    })
    .catch(error => {
      dispatch(createUsernameFailure(lang.t(`error.${error.translation_key}`)));
    });
};

export const changeView = view => dispatch => {
  switch(view) {
  case 'SIGNUP':
    window.resizeTo(500, 800);
    break;
  case 'FORGOT':
    window.resizeTo(500, 400);
    break;
  default:
    window.resizeTo(500, 550);
  }
  dispatch({
    type: actions.CHANGE_VIEW,
    view
  });
};

export const cleanState = () => ({type: actions.CLEAN_STATE});

// Sign In Actions

const signInRequest = () => ({type: actions.FETCH_SIGNIN_REQUEST});

// TODO: revisit login redux flow.
// const signInSuccess = (user, isAdmin) => ({type: actions.FETCH_SIGNIN_SUCCESS, user, isAdmin});
//
const signInFailure = error => ({type: actions.FETCH_SIGNIN_FAILURE, error});

export const fetchSignIn = (formData) => (dispatch) => {
  dispatch(signInRequest());
  return coralApi('/auth/local', {method: 'POST', body: formData})
    .then(() => dispatch(hideSignInDialog()))
    .catch(error => {
      if (error.metadata) {

        // the user might not have a valid email. prompt the user user re-request the confirmation email
        dispatch(signInFailure(lang.t('error.emailNotVerified', error.metadata)));
      } else {

        // invalid credentials
        dispatch(signInFailure(lang.t('error.emailPasswordError')));
      }
    });
};

// Sign In - Facebook

const signInFacebookRequest = () => ({type: actions.FETCH_SIGNIN_FACEBOOK_REQUEST});
const signInFacebookSuccess = user => ({type: actions.FETCH_SIGNIN_FACEBOOK_SUCCESS, user});
const signInFacebookFailure = error => ({type: actions.FETCH_SIGNIN_FACEBOOK_FAILURE, error});

export const fetchSignInFacebook = () => dispatch => {
  dispatch(signInFacebookRequest());
  window.open(
    `${base}/auth/facebook`,
    'Continue with Facebook',
    'menubar=0,resizable=0,width=500,height=500,top=200,left=500'
  );
};

// Sign Up Facebook

const signUpFacebookRequest = () => ({type: actions.FETCH_SIGNUP_FACEBOOK_REQUEST});

export const fetchSignUpFacebook = () => dispatch => {
  dispatch(signUpFacebookRequest());
  window.open(
    `${base}/auth/facebook`,
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
    const user = JSON.parse(data);
    dispatch(signInFacebookSuccess(user));
    dispatch(hideSignInDialog());
    dispatch(showCreateUsernameDialog());
    dispatch(hideSignInDialog());
  } catch (err) {
    dispatch(signInFacebookFailure(err));
    return;
  }
};

// Sign Up Actions

const signUpRequest = () => ({type: actions.FETCH_SIGNUP_REQUEST});
const signUpSuccess = user => ({type: actions.FETCH_SIGNUP_SUCCESS, user});
const signUpFailure = error => ({type: actions.FETCH_SIGNUP_FAILURE, error});

export const fetchSignUp = (formData, redirectUri) => (dispatch) => {
  dispatch(signUpRequest());

  coralApi('/users', {method: 'POST', body: formData, headers: {'X-Pym-Url': redirectUri}})
    .then(({user}) => {
      dispatch(signUpSuccess(user));
    })
    .catch(error => {
      dispatch(signUpFailure(lang.t(`error.${error.message}`)));
    });
};

// Forgot Password Actions

const forgotPassowordRequest = () => ({type: actions.FETCH_FORGOT_PASSWORD_REQUEST});
const forgotPassowordSuccess = () => ({type: actions.FETCH_FORGOT_PASSWORD_SUCCESS});
const forgotPassowordFailure = () => ({type: actions.FETCH_FORGOT_PASSWORD_FAILURE});

export const fetchForgotPassword = email => (dispatch) => {
  dispatch(forgotPassowordRequest(email));
  const redirectUri = pym.parentUrl || location.href;
  coralApi('/account/password/reset', {method: 'POST', body: {email, loc: redirectUri}})
    .then(() => dispatch(forgotPassowordSuccess()))
    .catch(error => dispatch(forgotPassowordFailure(error)));
};

// LogOut Actions

const logOutRequest = () => ({type: actions.LOGOUT_REQUEST});
const logOutSuccess = () => ({type: actions.LOGOUT_SUCCESS});
const logOutFailure = () => ({type: actions.LOGOUT_FAILURE});

export const logout = () => dispatch => {
  dispatch(logOutRequest());
  return coralApi('/auth', {method: 'DELETE'})
    .then(() => {
      dispatch(logOutSuccess());
      fetchMe();
    })
    .catch(error => dispatch(logOutFailure(error)));
};

// LogOut Actions

export const validForm = () => ({type: actions.VALID_FORM});
export const invalidForm = error => ({type: actions.INVALID_FORM, error});

// Check Login

const checkLoginRequest = () => ({type: actions.CHECK_LOGIN_REQUEST});
const checkLoginSuccess = (user, isAdmin) => ({type: actions.CHECK_LOGIN_SUCCESS, user, isAdmin});
const checkLoginFailure = error => ({type: actions.CHECK_LOGIN_FAILURE, error});

export const checkLogin = () => dispatch => {
  dispatch(checkLoginRequest());
  coralApi('/auth')
    .then((result) => {
      if (!result.user) {
        throw new Error('Not logged in');
      }

      const isAdmin = !!result.user.roles.filter(i => i === 'ADMIN').length;
      dispatch(checkLoginSuccess(result.user, isAdmin));
    })
    .catch(error => {
      console.error(error);
      dispatch(checkLoginFailure(`${error.translation_key}`));
    });
};

const verifyEmailRequest = () => ({type: actions.VERIFY_EMAIL_REQUEST});
const verifyEmailSuccess = () => ({type: actions.VERIFY_EMAIL_SUCCESS});
const verifyEmailFailure = () => ({type: actions.VERIFY_EMAIL_FAILURE});

export const requestConfirmEmail = (email, redirectUri) => dispatch => {
  dispatch(verifyEmailRequest());
  return coralApi('/users/resend-verify', {method: 'POST', body: {email}, headers: {'X-Pym-Url': redirectUri}})
    .then(() => {
      dispatch(verifyEmailSuccess());
    })
    .catch(err => {

      // email might have already been verifyed
      dispatch(verifyEmailFailure(err));
    });
};
