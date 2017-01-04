import {Map, Set} from 'immutable';
import * as types from '../constants/actions';

const initialState = Map({
  ids: Set(),
  byId: Map()
});

export default (state = initialState, action) => {
  switch (action.type) {
  case types.ACTIONS_MODERATION_QUEUE_FETCH_SUCCESS: return addActions(state, action);
  default:
    return state;
  }
};

const addActions = (state, action) => {
  const ids = action.actions.map(action => action.item_id);
  const map = action.actions.reduce((memo, action) => {
    memo[action.item_id] = action;
    return memo;
  }, {});
  return state.set('byId', map).set('ids', ids);
};
