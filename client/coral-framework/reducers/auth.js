import {Map} from 'immutable';

import {
  SHOW_SIGNIN_DIALOG,
  HIDE_SIGNIN_DIALOG,
  CHANGE_VIEW
} from '../constants/auth';

const initialState = Map({
  auth: Map(),
  loggedIn: false,
  error: '',
  user: {},
  showSignInDialog: false,
  view: 'SIGNIN'
});

export default function community (state = initialState, action) {
  switch (action.type) {
  case SHOW_SIGNIN_DIALOG :
    return state
      .set('showSignInDialog', true);
  case HIDE_SIGNIN_DIALOG :
    return state
      .set('showSignInDialog', false);
  case CHANGE_VIEW :
    return state
      .set('view', action.view);
  default :
    return state;
  }
}
