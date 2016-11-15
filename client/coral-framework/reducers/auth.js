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
  LOGOUT_SUCCESS
} from '../constants/auth';

const initialState = Map({
  auth: Map(),
  isLoading: false,
  loggedIn: false,
  user: null,
  showSignInDialog: false,
  view: 'SIGNIN',
  signInError: ''
});

export const getEmail = state => state.auth.formData.email;

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
  case LOGOUT_SUCCESS:
    return state
      .set('loggedIn', false)
      .set('user', null);
  default :
    return state;
  }
}
