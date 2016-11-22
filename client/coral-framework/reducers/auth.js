import {Map} from 'immutable';
import * as actions from '../constants/auth';

const initialState = Map({
  isLoading: false,
  loggedIn: false,
  user: null,
  showSignInDialog: false,
  view: 'SIGNIN',
  error: '',
  passwordRequestSuccess: null,
  passwordRequestFailure: null,
  successSignUp: false
});

export default function auth (state = initialState, action) {
  switch (action.type) {
  case actions.SHOW_SIGNIN_DIALOG :
    return state
      .set('showSignInDialog', true);
  case actions.HIDE_SIGNIN_DIALOG :
    return state.merge(Map({
      isLoading: false,
      showSignInDialog: false,
      view: 'SIGNIN',
      error: '',
      passwordRequestFailure: null,
      passwordRequestSuccess: null,
      successSignUp: false
    }));
  case actions.CHANGE_VIEW :
    return state
      .set('error', '')
      .set('view', action.view);
  case actions.CLEAN_STATE:
    return initialState;
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
      .set('user', action.user);
  case actions.FETCH_SIGNIN_SUCCESS:
    return state
      .set('loggedIn', true)
      .set('user', action.user);
  case actions.FETCH_SIGNIN_FAILURE:
    return state
      .set('isLoading', false)
      .set('error', action.error)
      .set('user', null);
  case actions.FETCH_SIGNIN_FACEBOOK_SUCCESS:
    return state
      .set('user', action.user)
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
    return state
      .set('loggedIn', false)
      .set('user', null);
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
  default :
    return state;
  }
}
