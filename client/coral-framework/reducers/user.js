import {Map, Set} from 'immutable';
import * as authActions from '../constants/auth';
import * as actions from '../constants/user';
import * as assetActions from '../constants/assets';

const initialState = Map({
  username: '',
  profiles: [],
  settings: {},
  myComments: [],
  myAssets: [], // the assets from which myComments (above) originated
  ignoredUsers: Set(),
});

const purge = (user) => {
  const {_id, created_at, updated_at, __v, roles, ...userData} = user; // eslint-disable-line
  return userData;
};

export default function user (state = initialState, action) {
  switch (action.type) {
  case authActions.CHECK_LOGIN_SUCCESS:
    return state.merge(Map(purge(action.user)));
  case authActions.CHECK_LOGIN_FAILURE:
    return initialState;
  case authActions.FETCH_SIGNIN_SUCCESS:
    return state.merge(Map(purge(action.user)));
  case authActions.FETCH_SIGNIN_FAILURE:
    return initialState;
  case authActions.FETCH_SIGNIN_FACEBOOK_SUCCESS:
    return state.merge(Map(purge(action.user)));
  case authActions.FETCH_SIGNIN_FACEBOOK_FAILURE:
    return initialState;
  case actions.SAVE_BIO_SUCCESS:
    return state.set('settings', action.settings);
  case actions.COMMENTS_BY_USER_SUCCESS:
    return state.set('myComments', action.comments);
  case assetActions.MULTIPLE_ASSETS_SUCCESS:
    return state.set('myAssets', action.assets);
  case actions.LOGOUT_SUCCESS:
    return initialState;
  case 'APOLLO_MUTATION_RESULT':
    switch (action.operationName) {
    case 'ignoreUser':
      return state.updateIn(['ignoredUsers'], (i) => i.add(action.variables.id));        
    case 'stopIgnoringUser':
      return state.updateIn(['ignoredUsers'], (i) => i.delete(action.variables.id));
    }
    break;
  }
  return state;
}
