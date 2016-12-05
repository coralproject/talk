import {Map, List, fromJS} from 'immutable';

const initialState = Map({
  byId: Map(),
  ids: List()
});

export default (state = initialState, action) => {
  switch (action.type) {
  case 'USERS_MODERATION_QUEUE_FETCH_SUCCESS': return replaceUsers(action, state);
  default: return state;
  }
};

// Replace the comment list with a new one
const replaceUsers = (action, state) => {
  const users = fromJS(action.users.reduce((prev, curr) => { prev[curr.id] = curr; return prev; }, {}));
  return state.set('byId', users)
  .set('ids', List(users.keys()));
};
