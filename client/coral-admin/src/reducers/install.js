import {Map} from 'immutable';

import * as actions from '../constants/install';

const initialState = Map({
  data: Map(),
  errors: Map(),
  showErrors: false,
  hasError: false,
  step: 0,
  navItems: [{
    text: '1. Add Organization Name',
    step: 1
  },
  {
    text: '2. Create your account',
    step: 2
  }]
});

export default function install (state = initialState, action) {
  switch (action.type) {
  case actions.NEXT_STEP:
    return state
      .set('step', state.get('step') + 1);
  case actions.PREVIOUS_STEP:
    return state
      .set('step', state.get('step') - 1);
  case actions.GO_TO_STEP:
    return state
      .set('step', action.step);
  case actions.UPDATE_FORMDATA_SETTINGS:
    return state
      .setIn(['data', 'settings', action.name], action.value);
  case actions.UPDATE_FORMDATA_USER:
    return state
      .setIn(['data', 'user', action.name], action.value);
  case actions.SHOW_ERRORS:
    return state
      .set('showErrors', action.show);
  case actions.HAS_ERROR:
    return state
      .set('hasError', action.has);
  case actions.ADD_ERROR:
    return state
      .setIn(['errors', action.name], action.error);
  case actions.NO_ERROR:
    return state
      .set('errors', Map());
  default :
    return state;
  }
}
