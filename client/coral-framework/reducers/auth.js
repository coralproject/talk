import {Map, fromJS} from 'immutable';
import * as actions from '../constants/auth';

const initialState = Map({
  isLoading: false,
  loggedIn: false,
  isAdmin: false,
  user: null,
  showSignInDialog: false,
  showCreateDisplayNameDialog: false,
  view: 'SIGNIN',
  error: '',
  passwordRequestSuccess: null,
  passwordRequestFailure: null,
  emailVerificationFailure: false,
  emailVerificationLoading: false,
  emailVerificationSuccess: false,
  successSignUp: false,
  fromSignUp: false
});

const purge = user => {
  const {settings, profiles, ...userData} = user; // eslint-disable-line
  return fromJS(userData);
};

export default function auth (state = initialState, action) {
  switch (action.type) {
  case actions.SHOW_SIGNIN_DIALOG :
    return state
      .set('showSignInDialog', true)
      .set('signInOffset', action.offset);
  case actions.HIDE_SIGNIN_DIALOG :
    return state.merge(Map({
      isLoading: false,
      showSignInDialog: false,
      view: 'SIGNIN',
      error: '',
      passwordRequestFailure: null,
      passwordRequestSuccess: null,
      emailVerificationFailure: false,
      emailVerificationSuccess: false,
      emailVerificationLoading: false,
      successSignUp: false
    }));
  case actions.SHOW_CREATEDISPLAYNAME_DIALOG :
    return state
      .set('showCreateDisplayNameDialog', true);
  case actions.HIDE_CREATEDISPLAYNAME_DIALOG :
    return state.merge(Map({
      showCreateDisplayNameDialog: false
    }));
  case actions.CREATEDISPLAYNAME_SUCCESS :
    return state.merge(Map({
      showCreateDisplayNameDialog: false,
      error: ''
    }));
  case actions.CREATEDISPLAYNAME_FAILURE :
    return state
      .set('error', action.error);
  case actions.CHANGE_VIEW :
    return state
      .set('error', '')
      .set('view', action.view);
  case actions.CLEAN_STATE:
    return initialState;
  case actions.CHECK_CSRF_TOKEN:
    return state
      .set('_csrf', action._csrf);
  case actions.FETCH_SIGNIN_REQUEST:
    return state
      .set('isLoading', true);
  case actions.CHECK_LOGIN_FAILURE:
    return state
      .set('loggedIn', false)
      .set('user', null);
  case actions.CHECK_LOGIN_SUCCESS:
    return state
      .set('loggedIn', true)
      .set('isAdmin', action.isAdmin)
      .set('user', purge(action.user));
  case actions.FETCH_SIGNIN_SUCCESS:
    return state
      .set('loggedIn', true)
      .set('isAdmin', action.isAdmin)
      .set('user', purge(action.user));
  case actions.FETCH_SIGNIN_FAILURE:
    return state
      .set('isLoading', false)
      .set('error', action.error)
      .set('user', null);
  case actions.FETCH_SIGNUP_FACEBOOK_REQUEST:
    return state
      .set('fromSignUp', true);
  case actions.FETCH_SIGNIN_FACEBOOK_REQUEST:
    return state
      .set('fromSignUp', false);
  case actions.FETCH_SIGNIN_FACEBOOK_SUCCESS:
    return state
      .set('user', purge(action.user))
      .set('loggedIn', true);
  case actions.FETCH_SIGNIN_FACEBOOK_FAILURE:
    return state
      .set('error', action.error)
      .set('user', null);
  case actions.FETCH_SIGNUP_REQUEST:
    return state
      .set('isLoading', true);
  case actions.FETCH_SIGNUP_FAILURE:
    return state
      .set('error', action.error)
      .set('isLoading', false);
  case actions.FETCH_SIGNUP_SUCCESS:
    return state
      .set('isLoading', false)
      .set('successSignUp', true);
  case actions.LOGOUT_SUCCESS:
    return initialState;
  case actions.INVALID_FORM:
    return state
      .set('error', action.error);
  case actions.VALID_FORM:
    return state
      .set('error', '');
  case actions.FETCH_FORGOT_PASSWORD_SUCCESS:
    return state
      .set('passwordRequestFailure', null)
      .set('passwordRequestSuccess', 'If you have a registered account, a password reset link was sent to that email');
  case actions.FETCH_FORGOT_PASSWORD_FAILURE:
    return state
      .set('passwordRequestFailure', 'There was an error sending your password reset email. Please try again soon!')
      .set('passwordRequestSuccess', null);
  case actions.UPDATE_DISPLAYNAME:
    console.log('Action', action);
    return state
      .setIn(['user', 'username'], action.username);
  case actions.VERIFY_EMAIL_FAILURE:
    return state
      .set('emailVerificationFailure', true)
      .set('emailVerificationLoading', false);
  case actions.VERIFY_EMAIL_REQUEST:
    return state.set('emailVerificationLoading', true);
  case actions.VERIFY_EMAIL_SUCCESS:
    return state
      .set('emailVerificationSuccess', true)
      .set('emailVerificationLoading', false);
  default :
    return state;
  }
}
