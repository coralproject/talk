import {Map} from 'immutable';

import {
  SHOW_SIGNIN_DIALOG,
  HIDE_SIGNIN_DIALOG,
  NEW_STEP
} from '../constants/auth';

const initialState = Map({
  auth: Map(),
  loggedIn: false,
  error: '',
  user: {},
  showSignInDialog: false,
  step: 1
});

export default function community (state = initialState, action) {
  switch (action.type) {
  case SHOW_SIGNIN_DIALOG :
    return state
      .set('showSignInDialog', true);
  case HIDE_SIGNIN_DIALOG :
    return state
      .set('showSignInDialog', false);
  case NEW_STEP :
    return state
      .set('step', action.step);
  default :
    return state;
  }
}
