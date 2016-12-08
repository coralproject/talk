/* @flow */

import {Map} from 'immutable';
import * as actions from '../actions/config';

const initialState = Map({
  features: Map({}),
  status: 'open'
});

export default (state = initialState, action) => {
  switch(action.type) {
  // Override config if worked
  case actions.UPDATE_SETTINGS:
    return state.merge(action.config);

  case actions.OPEN_COMMENTS:
    return state.set('status', 'open');

  case actions.CLOSE_COMMENTS:
    return state.set('status', 'closed');

  case actions.ADD_ITEM:
    return action.item_type === 'assets' ?
      state.set('status', action.item.status)
    : state;

  default:
    return state;
  }
};
