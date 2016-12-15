import {Map, fromJS} from 'immutable';
import * as authActions from '../constants/auth';
import * as actions from '../constants/user';
import * as assetActions from '../constants/assets';

const initialState = Map({
  displayName: '',
  profiles: [],
  settings: {},
  myComments: [],
  myAssets: [] // the assets from which myComments (above) originated
});

const purge = user => {
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
    return state
      .set('settings', action.settings);
  case actions.COMMENTS_BY_USER_SUCCESS:
    return state.set('myComments', fromJS(action.comments));
  case assetActions.MULTIPLE_ASSETS_SUCCESS:
    return state.set('myAssets', fromJS(action.assets));
  default :
    return state;
  }
}
