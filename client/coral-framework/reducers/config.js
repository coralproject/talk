/* @flow */

import {Map} from 'immutable';
import * as actions from '../actions/items';

const initialState = Map({
  features: Map({})
});

export default (state = initialState, action) => {
  switch(action.type) {

  // Override config if worked
  case actions.UPDATE_SETTINGS:
    return action.config;

  default:
    return state;
  }
};
