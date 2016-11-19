
import {Map, List} from 'immutable';

const initialState = Map({
  byId: Map(),
  ids: List(),
  loading: false
});

// Handle the users actions
export default (state = initialState, action) => {
  switch (action.type) {
  case 'USER_STATUS_UPDATE': return updateUserStatus(state, action);
  default: return state;
  }
};

// Update a user status
const updateUserStatus = (state, action) => {
  const byId = state.get('byId');
  const data = byId.get(action.id).set('status', action.status.toLowerCase());
  return state.set('byId', byId.set(action.id, data));
};
