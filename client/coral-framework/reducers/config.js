import {Map} from 'immutable';
import * as actions from '../constants/config';

const initialState = Map({
  features: Map({}),
  status: 'open',
  moderation: null
});

export default (state = initialState, action) => {
  switch(action.type) {
  case actions.UPDATE_CONFIG:
    return state
      .merge(Map(action.config));
  case actions.UPDATE_CONFIG_SUCCESS:
    return state
      .merge(Map(action.config));
  case actions.OPEN_COMMENTS:
    return state
      .set('status', 'open');
  case actions.CLOSE_COMMENTS:
    return state
      .set('status', 'closed');
  case actions.ADD_ITEM:
    return action.item_type === 'assets' ? state.set('status', (action.item && action.item.closedAt && new Date(action.item.closedAt).getTime() <= new Date().getTime()) ? 'closed' : 'open') : state;
  default:
    return state;
  }
};
