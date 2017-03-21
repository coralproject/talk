import {Map, List, fromJS} from 'immutable';
import * as actions from '../constants/assets';

const initialState = Map({
  byId: Map(),
  ids: List(),
  assets: List()
});

export default function assets (state = initialState, action) {
  switch (action.type) {
  case actions.FETCH_ASSETS_SUCCESS:
    return replaceAssets(action, state);
  case actions.UPDATE_ASSET_STATE_REQUEST:
    return state
      .setIn(['byId', action.id, 'closedAt'], action.closedAt);
  case actions.UPDATE_ASSETS:
    return state
      .set('assets', List(action.assets));
  default:
    return state;
  }
}

const replaceAssets = (action, state) => {
  const assets = fromJS(action.assets.reduce((prev, curr) => {
    prev[curr.id] = curr;
    return prev;
  }, {}));

  return state
    .set('byId', assets)
    .set('count', action.count)
    .set('ids', List(assets.keys()));
};
