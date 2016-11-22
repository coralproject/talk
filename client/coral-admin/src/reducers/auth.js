import {Map} from 'immutable';
import * as actions from '../constants/auth';

const initialState = Map({
  loggedIn: false,
  user: null,
  isAdmin: false
});

export default function auth (state = initialState, action) {
  switch (action.type) {
  case actions.CHECK_LOGIN_FAILURE:
    return state
      .set('loggedIn', false)
      .set('user', null);
  case actions.CHECK_LOGIN_SUCCESS:
    return state
      .set('loggedIn', true)
      .set('isAdmin', action.isAdmin)
      .set('user', action.user);
  case actions.LOGOUT_SUCCESS:
    return state
      .set('loggedIn', false)
      .set('user', null);
  default :
    return state;
  }
}
