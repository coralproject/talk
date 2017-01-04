import {Map} from 'immutable';
import * as actions from '../constants/auth';

const initialState = Map({
  loggedIn: false,
  user: null,
  isAdmin: false,
  _csrf: ''
});

export default function auth (state = initialState, action) {
  switch (action.type) {
  case actions.CHECK_LOGIN_REQUEST:
    return state
      .set('loadingUser', true);
  case actions.CHECK_LOGIN_FAILURE:
    return state
      .set('loggedIn', false)
      .set('loadingUser', false)
      .set('user', null);
  case actions.CHECK_LOGIN_SUCCESS:
    return state
      .set('loggedIn', true)
      .set('loadingUser', false)
      .set('isAdmin', action.isAdmin)
      .set('user', action.user);
  case actions.LOGOUT_SUCCESS:
    return initialState;
  case actions.CHECK_CSRF_TOKEN:
    return state
      .set('_csrf', action._csrf);
  default :
    return state;
  }
}
