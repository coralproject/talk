import * as actions from '../constants/auth';
import pym from 'coral-framework/services/pym';
import merge from 'lodash/merge';

const initialState = {
  isLoading: false,
  loggedIn: false,
  user: null,
  showSignInDialog: false,
  signInDialogFocus: false,
  showCreateUsernameDialog: false,
  checkedInitialLogin: false,
  view: 'SIGNIN',
  error: null,
  passwordRequestSuccess: null,
  passwordRequestFailure: null,
  emailVerificationFailure: false,
  emailVerificationLoading: false,
  emailVerificationSuccess: false,
  successSignUp: false,
  fromSignUp: false,
  requireEmailConfirmation: false,
  redirectUri: pym.parentUrl || location.href,
};

const purge = user => {
  const {settings, ...userData} = user; // eslint-disable-line
  return userData;
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case actions.FOCUS_SIGNIN_DIALOG:
      return {
        ...state,
        signInDialogFocus: true,
      };
    case actions.BLUR_SIGNIN_DIALOG:
      return {
        ...state,
        signInDialogFocus: false,
      };
    case actions.SHOW_SIGNIN_DIALOG:
      return {
        ...state,
        showSignInDialog: true,
        signInDialogFocus: true,
      };
    case actions.RESET_SIGNIN_DIALOG:
    case actions.HIDE_SIGNIN_DIALOG:
      return {
        ...state,
        isLoading: false,
        showSignInDialog: false,
        signInDialogFocus: false,
        view: 'SIGNIN',
        error: null,
        passwordRequestFailure: null,
        passwordRequestSuccess: null,
        emailVerificationFailure: false,
        emailVerificationSuccess: false,
        emailVerificationLoading: false,
        successSignUp: false,
      };
    case actions.SHOW_CREATEUSERNAME_DIALOG:
      return {
        ...state,
        showCreateUsernameDialog: true,
      };
    case actions.HIDE_CREATEUSERNAME_DIALOG:
      return {
        ...state,
        showCreateUsernameDialog: false,
      };
    case actions.CREATE_USERNAME_SUCCESS:
      return {
        ...state,
        showCreateUsernameDialog: false,
        error: null,
      };
    case actions.CREATE_USERNAME_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case actions.CHANGE_VIEW:
      return {
        ...state,
        error: action.error,
        view: action.view,
      };
    case actions.CLEAN_STATE:
      return initialState;
    case actions.FETCH_SIGNIN_REQUEST:
      return {
        ...state,
        email: action.email,
        isLoading: true,
      };
    case actions.CHECK_LOGIN_FAILURE:
      return {
        ...state,
        checkedInitialLogin: true,
        loggedIn: false,
        user: null,
      };
    case actions.CHECK_LOGIN_SUCCESS:
      return {
        ...state,
        checkedInitialLogin: true,
        loggedIn: true,
        user: purge(action.user),
      };
    case actions.FETCH_SIGNIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        user: purge(action.user),
      };
    case actions.FETCH_SIGNIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
        user: null,
        view:
          action.error.translation_key === 'EMAIL_NOT_VERIFIED'
            ? 'RESEND_VERIFICATION'
            : state.view,
      };
    case actions.FETCH_SIGNUP_FACEBOOK_REQUEST:
      return {
        ...state,
        fromSignUp: true,
      };
    case actions.FETCH_SIGNIN_FACEBOOK_REQUEST:
      return {
        ...state,
        fromSignUp: false,
      };
    case actions.FETCH_SIGNIN_FACEBOOK_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        user: purge(action.user),
      };
    case actions.FETCH_SIGNIN_FACEBOOK_FAILURE:
      return {
        ...state,
        error: action.error,
        user: null,
      };
    case actions.FETCH_SIGNUP_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actions.FETCH_SIGNUP_FAILURE:
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    case actions.FETCH_SIGNUP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        successSignUp: true,
      };
    case actions.LOGOUT:
      return {
        ...state,
        user: null,
        isLoading: false,
        loggedIn: false,
      };
    case actions.INVALID_FORM:
      return {
        ...state,
        error: action.error,
      };
    case actions.VALID_FORM:
      return {
        ...state,
        error: null,
      };
    case actions.FETCH_FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        passwordRequestFailure: null,
        passwordRequestSuccess:
          'If you have a registered account, a password reset link was sent to that email',
      };
    case actions.FETCH_FORGOT_PASSWORD_FAILURE:
      return {
        ...state,
        passwordRequestFailure:
          'There was an error sending your password reset email. Please try again soon!',
        passwordRequestSuccess: null,
      };
    case actions.UPDATE_USERNAME:
      return {
        ...state,
        user: {
          ...state.user,
          username: action.username,
          lowercaseUsername: action.username.toLowerCase(),
        },
      };
    case actions.VERIFY_EMAIL_FAILURE:
      return {
        ...state,
        emailVerificationFailure: action.error,
        emailVerificationLoading: false,
      };
    case actions.VERIFY_EMAIL_REQUEST:
      return {
        ...state,
        emailVerificationLoading: true,
      };
    case actions.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        emailVerificationSuccess: true,
        emailVerificationLoading: false,
      };
    case actions.SET_REQUIRE_EMAIL_VERIFICATION:
      return {
        ...state,
        requireEmailConfirmation: action.required,
      };
    case actions.SET_REDIRECT_URI:
      return {
        ...state,
        redirectUri: action.uri,
      };
    case actions.UPDATE_STATUS: {
      return {
        ...state,
        user: {
          ...state.user,
          status: merge({}, state.user.status, action.status),
        },
      };
    }
    default:
      return state;
  }
}
