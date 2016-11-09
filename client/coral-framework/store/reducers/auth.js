/* Auth */

import * as actions from '../actions/auth';
import {fromJS} from 'immutable';

const initialState = fromJS({});

export default (state = initialState, action) => {
  switch (action.type) {
  case actions.SET_LOGGED_IN_USER:
    return state.set('user', action.user_id);
  case actions.LOG_OUT_USER:
    return initialState;
  default:
    return state;
  }
};
