import coralApi from '../../../coral-framework/helpers/response';

/**
 * The adapter is a redux middleware that interecepts the actions that need
 * to interface with the backend, do the job and return the results.
 * The idea is that if we expose the required actions to handle to devs, the
 * moderation app can be platform agnostic. This same client could work not only
 * for the coral but also for wordpress comments, disqus and many more.
 */

// Intercept redux actions and act over the ones we are interested
export default store => next => action => {

  switch (action.type) {
  case 'COMMENTS_MODERATION_QUEUE_FETCH':
    fetchModerationQueueComments(store);
    break;
  case 'COMMENT_UPDATE':
    updateComment(store, action.comment);
    break;
  case 'COMMENT_CREATE':
    createComment(store, action.name, action.body);
    break;
  case 'USER_BAN':
    userStatusUpdate(store, action.status, action.userId, action.commentId);
    break;
  }

  next(action);
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
  .then(res => store.dispatch({type: 'USER_BAN_SUCESS', res}))
  .catch(error => store.dispatch({type: 'USER_BAN_FAILED', error}));
};
