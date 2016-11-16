import {Map} from 'immutable';

import {
  SHOW_SIGNIN_DIALOG,
  HIDE_SIGNIN_DIALOG,
  CHANGE_VIEW,
  CLEAN_STATE,
  FETCH_SIGNIN_REQUEST,
  FETCH_SIGNIN_FAILURE,
  FETCH_SIGNIN_SUCCESS,
  FETCH_SIGNIN_FACEBOOK_SUCCESS,
  FETCH_SIGNIN_FACEBOOK_FAILURE,
  LOGOUT_SUCCESS,
  FETCH_SIGNUP_FAILURE,
  AVAILABLE_FIELD,
  UNAVAILABLE_FIELD
} from '../constants/auth';

const initialState = Map({
  isLoading: false,
  loggedIn: false,
  user: null,
  showSignInDialog: false,
  view: 'SIGNIN',
  signInError: '',
  signUpError: '',
  emailAvailable: true,
  displayNameAvailable: true,
});

export default function auth (state = initialState, action) {
  switch (action.type) {
  case SHOW_SIGNIN_DIALOG :
    return state
      .set('showSignInDialog', true);
  case HIDE_SIGNIN_DIALOG :
    return initialState;
  case CHANGE_VIEW :
    return state
      .set('view', action.view);
  case CLEAN_STATE:
    return initialState;
  case FETCH_SIGNIN_REQUEST:
    return state
      .set('isLoading', true);
  case FETCH_SIGNIN_FAILURE:
    return state
      .set('isLoading', false)
      .set('signInError', action.error);
  case FETCH_SIGNIN_SUCCESS:
    return state
      .set('signInError', '')
      .set('isLoading', false)
      .set('loggedIn', true)
      .set('user', action.user)
      .set('showSignInDialog', false);
  case FETCH_SIGNIN_FACEBOOK_SUCCESS:
    return state
      .set('user', action.user)
      .set('loggedIn', true)
      .set('showSignInDialog', false);
  case FETCH_SIGNIN_FACEBOOK_FAILURE:
    return state
      .set('error', action.error)
      .set('user', null);
  case FETCH_SIGNUP_FAILURE:
    console.log(action);
    return state
      .set('signUpError', action.error);
  case LOGOUT_SUCCESS:
    return state
      .set('loggedIn', false)
      .set('user', null);
  case AVAILABLE_FIELD:
    return state
      .set(`${action.field}Available`, true);
  case UNAVAILABLE_FIELD:
    return state
      .set(`${action.field}Available`, false);
  default :
    return state;
  }
}
