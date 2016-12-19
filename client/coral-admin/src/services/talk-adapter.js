import coralApi from '../../../coral-framework/helpers/response';
import {
  FETCH_ASSETS,
  FETCH_ASSETS_FAILED,
  FETCH_ASSETS_SUCCESS,
  UPDATE_ASSET_STATE,
  UPDATE_ASSET_STATE_SUCCESS,
  UPDATE_ASSET_STATE_FAILED,
} from '../constants/assets';
/**
 * The adapter is a redux middleware that interecepts the actions that need
 * to interface with the backend, do the job and return the results.
 * The idea is that if we expose the required actions to handle to devs, the
 * moderation app can be platform agnostic. This same client could work not only
 * for the coral but also for wordpress comments, disqus and many more.
 */

// Intercept redux actions and act over the ones we are interested
export default store => next => action => {

  next(action);

  switch (action.type) {
  case 'COMMENTS_MODERATION_QUEUE_FETCH':
    return fetchModerationQueueComments(store);
  case 'COMMENT_UPDATE':
    return updateComment(store, action.comment);
  case 'COMMENT_CREATE':
    return createComment(store, action.name, action.body);
  case 'USER_BAN':
    return userStatusUpdate(store, action.status, action.userId, action.commentId);
  case FETCH_ASSETS:
    return fetchAssets(store, action);
  case UPDATE_ASSET_STATE:
    return updateAssetState(store, action);
  }
};

// Get comments to fill each of the three lists on the mod queue
const fetchModerationQueueComments = store =>

Promise.all([
  coralApi('/queue/comments/pending'),
  coralApi('/comments?status=rejected'),
  coralApi('/comments?action_type=flag')
])
.then(([pending, rejected, flagged]) => {

  /* Combine seperate calls into a single object */
  let all = {};
  all.comments = pending.comments
    .concat(rejected.comments)
    .concat(flagged.comments.map(comment => {
      comment.flagged = true;
      return comment;
    }));
  all.users = pending.users
    .concat(rejected.users)
    .concat(flagged.users);
  all.actions = pending.actions
    .concat(rejected.actions)
    .concat(flagged.actions);
  return all;
})
.then(all => {

  /* Post comments and users to redux store. Actions will be posted when they are needed. */
  store.dispatch({type: 'USERS_MODERATION_QUEUE_FETCH_SUCCESS',
    users: all.users});
  store.dispatch({type: 'COMMENTS_MODERATION_QUEUE_FETCH_SUCCESS',
    comments: all.comments});

});

// .catch(error => store.dispatch({type: 'COMMENTS_MODERATION_QUEUE_FETCH_FAILED', error}));

// Update a comment. Now to update a comment we need to send back the whole object

const updateComment = (store, comment) => {
  coralApi(`/comments/${comment.get('id')}/status`, {method: 'PUT', body: {status: comment.get('status')}})
  .then(res => store.dispatch({type: 'COMMENT_UPDATE_SUCCESS', res}))
  .catch(error => store.dispatch({type: 'COMMENT_UPDATE_FAILED', error}));
};

// Create a new comment
const createComment = (store, name, comment) => {
  const body = {
    status: 'Untouched',
    body: comment,
    name: name,
    createdAt: Date.now()
  };
  return coralApi('/comments', {method: 'POST', body})
    .then(res => store.dispatch({type: 'COMMENT_CREATE_SUCCESS', comment: res}))
    .catch(error => store.dispatch({type: 'COMMENT_CREATE_FAILED', error}));
};

// Ban a user
const userStatusUpdate = (store, status, userId, commentId) => {
  return coralApi(`/users/${userId}/status`, {method: 'POST', body: {status: status, comment_id: commentId}})
  .then(res => store.dispatch({type: 'USER_BAN_SUCCESS', res}))
  .catch(error => store.dispatch({type: 'USER_BAN_FAILED', error}));
};

// Fetch a page of assets
// Get comments to fill each of the three lists on the mod queue
const fetchAssets = (store, action) => {
  const {skip, limit, sort, search, filter} = action;
  return coralApi(`/assets?skip=${skip}&limit=${limit}&sort=${sort}&search=${search}&filter=${filter}`)
  .then(({result, count}) =>
    /* Post comments and users to redux store. Actions will be posted when they are needed. */
    store.dispatch({type: FETCH_ASSETS_SUCCESS,
      assets: result,
      count
    }))
    .catch(error => store.dispatch({type: FETCH_ASSETS_FAILED, error}));
};

// Update an asset state
// Get comments to fill each of the three lists on the mod queue
const updateAssetState = (store, action) => {
  const {id, closedAt} = action;
  return coralApi(`/assets/${id}/status`, {method: 'PUT', body: {closedAt}})
  .then(() =>
    /* Post comments and users to redux store. Actions will be posted when they are needed. */
    store.dispatch({type: UPDATE_ASSET_STATE_SUCCESS}))
    .catch(error => store.dispatch({type: UPDATE_ASSET_STATE_FAILED, error}));
};
