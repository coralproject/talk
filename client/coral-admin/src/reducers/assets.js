import {Map, List, fromJS} from 'immutable';
import {FETCH_ASSETS_SUCCESS} from '../constants/assets';

const initialState = Map({
  byId: Map(),
  ids: List()
});

export default (state = initialState, action) => {
  switch (action.type) {
  case FETCH_ASSETS_SUCCESS: return replaceAssets(action, state);
  default: return state;
  }
};

const replaceAssets = (action, state) => {
  const assets = fromJS(action.assets.reduce((prev, curr) => { prev[curr.id] = curr; return prev; }, {}));
  return state.set('byId', assets)
  .set('count', action.count)
  .set('ids', List(assets.keys()));
};
