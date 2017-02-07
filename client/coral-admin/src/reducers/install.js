import {Map} from 'immutable';

import * as actions from '../constants/install';

const initialState = Map({
  isLoading: false,
  data: Map({
    settings: Map({
      organizationName: ''
    }),
    user: Map({
      displayName: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }),
  errors: Map({
    organizationName: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  }),
  showErrors: false,
  hasError: false,
  error: null,
  step: 0,
  navItems: [{
    text: '1. Add Organization Name',
    step: 1
  },
  {
    text: '2. Create your account',
    step: 2
  }],
  installRequest: null,
  installRequestError: null,
  alreadyInstalled: false
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
  case actions.HAS_ERROR:
    return state
      .merge({
        hasError: true,
        showErrors: true
      });
  case actions.ADD_ERROR:
    return state
      .setIn(['errors', action.name], action.error);
  case actions.CLEAR_ERRORS:
    return state
      .set('errors', Map());
  case actions.INSTALL_REQUEST:
    return state
      .set('isLoading', true);
  case actions.INSTALL_SUCCESS:
    return state
      .set('isLoading', false)
      .set('installRequest', 'SUCCESS');
  case actions.INSTALL_FAILURE:
    return state
      .merge({
        isLoading: false,
        installRequest: 'FAILURE',
        installRequestError: action.error
      });
  case actions.CHECK_INSTALL_SUCCESS:
    return state
      .set('alreadyInstalled', action.installed);
  default :
    return state;
  }
}
