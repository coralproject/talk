import {Map} from 'immutable';
import * as actions from '../constants/auth';

const initialState = Map({
  isLoading: false,
  loggedIn: false,
  user: null,
  showSignInDialog: false,
  view: 'SIGNIN',
  signUpError: '',
  emailAvailable: true,
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
      signInError: '',
      signUpError: '',
      emailAvailable: true,
      successSignUp: false
    }));
  case actions.CHANGE_VIEW :
    return state
      .set('signInError', '')
      .set('view', action.view);
  case actions.CLEAN_STATE:
    return initialState;
  case actions.FETCH_SIGNIN_REQUEST:
    return state
      .set('isLoading', true);
  case actions.FETCH_SIGNIN_SUCCESS:
    return state
      .set('loggedIn', true)
      .set('user', action.user);
  case actions.FETCH_SIGNIN_FAILURE:
    return state
      .set('isLoading', false)
      .set('signInError', action.error);
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
      .set('isLoading', false);
  case actions.FETCH_SIGNUP_SUCCESS:
    return state
      .set('isLoading', false)
      .set('successSignUp', true);
  case actions.LOGOUT_SUCCESS:
    return state
      .set('loggedIn', false)
      .set('user', null);
  default :
    return state;
  }
}
