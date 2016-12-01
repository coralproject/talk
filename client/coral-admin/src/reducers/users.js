import {Map, List, fromJS} from 'immutable';
import * as actions from '../constants/users';

const initialState = Map({
  byId: Map(),
  ids: List(),
  showBanUserDialog: false
});

export default (state = initialState, action) => {
  switch (action.type) {
  case 'USERS_MODERATION_QUEUE_FETCH_SUCCESS': return replaceUsers(action, state);
  case 'USER_STATUS_UPDATE': return updateUserStatus(state, action);
  case actions.SHOW_BANUSER_DIALOG:
    return state
      .set('showBanUserDialog', true);
  case actions.HIDE_BANUSER_DIALOG:
    return state
      .set('showBanUserDialog', false);
  default: return state;
  }
};

// Replace the comment list with a new one
const replaceUsers = (action, state) => {
  const users = fromJS(action.users.reduce((prev, curr) => { prev[curr.id] = curr; return prev; }, {}));
  return state.set('byId', users)
  .set('ids', List(users.keys()));
};

// Update a user status
const updateUserStatus = (state, action) => {
  const byId = state.get('byId');
  const data = byId.get(action.author_id).set('status', action.status.toLowerCase());
  return state.set('byId', byId.set(action.author_id, data));
};
