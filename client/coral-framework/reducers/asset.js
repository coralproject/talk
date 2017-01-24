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
  case actions.FETCH_ASSET_SUCCESS :
    return state
        .merge(action.asset);
  case actions.UPDATE_CONFIG:
    return state
      .merge(action.config);
  case actions.UPDATE_CONFIG_SUCCESS:
    return state
      .merge(action.config);
  case actions.OPEN_COMMENTS:
    return state
      .set('status', 'open')
      .set('closedAt', null);
  case actions.CLOSE_COMMENTS:
    return state
      .set('status', 'closed')
      .set('closedAt', Date.now());
  default:
    return state;
  }
}
