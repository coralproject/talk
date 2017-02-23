import {Map} from 'immutable';
import * as actions from '../constants/asset';

const initialState = Map({
  closedAt: null,
  settings: null,
  title: null,
  url: null,
  features: Map({}),
  status: 'open',
  moderation: null
});

export default function asset (state = initialState, action) {
  switch (action.type) {
  case actions.FETCH_ASSET_SUCCESS:
    return state
        .merge(action.asset);
  case actions.UPDATE_ASSET_SETTINGS_SUCCESS:
    return state
      .setIn(['settings'], action.settings);
  case actions.UPDATE_COUNT_CACHE:
    return state
      .setIn(['countCache', action.id], action.count);
  default:
    return state;
  }
}
