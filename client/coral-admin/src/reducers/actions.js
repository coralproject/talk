import {Map, Set, fromJS} from 'immutable';
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
  
  // Make ids that are unique by item_id and by action type
  const typeId = (action) => `${action.action_type}_${action.item_id}`;
  const ids = action.actions.map(action => typeId(action));
  const map = action.actions.reduce((memo, action) => {
    memo[typeId(action)] = action;
    return memo;
  }, {});
  return state.set('byId', fromJS(map)).set('ids', new Set(ids));
};
