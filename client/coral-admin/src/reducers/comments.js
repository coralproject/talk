
import {Map, List, fromJS} from 'immutable';

/**
 * Comments state is stored using 2 structures:
 * - byId is a Map holding the comments using the item_id property as keys
 * - ids is a List of item_id, this allows us to order and iterate easily
 *   since maps are unordered and some times we just need a list of things
 */

const initialState = Map({
  byId: Map(),
  ids: List(),
  loading: false
});

// Handle the comment actions
export default (state = initialState, action) => {
  switch (action.type) {
  case 'COMMENTS_MODERATION_QUEUE_FETCH': return state.set('loading', true);
  case 'COMMENTS_MODERATION_QUEUE_FETCH_SUCCESS': return replaceComments(action, state);
  case 'COMMENTS_MODERATION_QUEUE_FAILED': return state.set('loading', false);
  case 'COMMENT_STATUS_UPDATE': return updateStatus(state, action);
  case 'COMMENT_FLAG': return flag(state, action);
  case 'COMMENT_CREATE_SUCCESS': return addComment(state, action);
  case 'COMMENT_STREAM_FETCH_SUCCESS': return replaceComments(action, state);
  default: return state;
  }
};

// Update a comment status
const updateStatus = (state, action) => {
  const byId = state.get('byId');
  const data = byId.get(action.id).get('data').set('status', action.status);
  const comment = byId.get(action.id).set('data', data);
  return state.set('byId', byId.set(action.id, comment));
};

// Flag a comment
const flag = (state, action) => {
  const byId = state.get('byId');
  const data = byId.get(action.id).set('flagged', true);
  const comment = byId.get(action.id).set('data', data);
  return state.set('byId', byId.set(action.id, comment));
};

// Replace the comment list with a new one
const replaceComments = (action, state) => {
  const comments = fromJS(action.comments.reduce((prev, curr) => { prev[curr._id] = curr; return prev; }, {}));
  return state.set('byId', comments).set('loading', false)
  .set('ids', List(comments.keys()));
};

// Add a new comment
const addComment = (state, action) => {
  const comment = fromJS(action.comment);
  return state.set('byId', state.get('byId').set(comment.get('item_id'), comment))
    .set('ids', state.get('ids').unshift(comment.get('item_id')));
};
