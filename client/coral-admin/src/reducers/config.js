import {Map} from 'immutable';

import * as actions from '../actions/config';

const initialState = Map({
  data: Map({})
});

export default function config (state = initialState, action) {
  switch (action.type) {
  case actions.CONFIG_UPDATED:
    return state.set('data', Map(action.data));
  default:
    return state;
  }
}
