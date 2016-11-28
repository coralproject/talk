import {base, handleResp, getInit} from '../helpers/response';

/**
 * The adapter is a redux middleware that interecepts the actions that need
 * to interface with the backend, do the job and return the results.
 * The idea is that if we expose the required actions to handle to devs, the
 * moderation app can be platform agnostic. This same client could work not only
 * for the coral but also for wordpress comments, disqus and many more.
 */

// Default headers for json payloads.
const jsonHeader = new Headers({'Content-Type': 'application/json'});

// Intercept redux actions and act over the ones we are interested
export default store => next => action => {

  switch (action.type) {
  case 'COMMENTS_MODERATION_QUEUE_FETCH':
    fetchModerationQueueComments(store);
    break;
  // case 'COMMENT_STREAM_FETCH':
  //   fetchCommentStream(store);
  //   break;
  case 'COMMENT_UPDATE':
    updateComment(store, action.comment);
    break;
  case 'COMMENT_CREATE':
    createComment(store, action.name, action.body);
    break;
  }

  next(action);
};

// Get comments to fill each of the three lists on the mod queue
const fetchModerationQueueComments = store =>

Promise.all([
  fetch(`${base}/queue/comments/pending`, getInit('GET')),
  fetch(`${base}/comments?status=rejected`, getInit('GET')),
  fetch(`${base}/comments?action_type=flag`, getInit('GET'))
])
.then(res => Promise.all(res.map(handleResp)))
.then(res => {
  res[2] = res[2].map(comment => { comment.flagged = true; return comment; });
  return res.reduce((prev, curr) => prev.concat(curr), []);
})
.then(res => store.dispatch({type: 'COMMENTS_MODERATION_QUEUE_FETCH_SUCCESS',
  comments: res}))
.catch(error => store.dispatch({type: 'COMMENTS_MODERATION_QUEUE_FETCH_FAILED', error}));

// Update a comment. Now to update a comment we need to send back the whole object

const updateComment = (store, comment) => {
  fetch(`${base}/comments/${comment.get('id')}/status`, getInit('PUT', {status: comment.get('status')}))
  .then(handleResp)
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
  return fetch(`${base}/comments`, getInit('POST', body))
    .then(handleResp)
    .then(res => store.dispatch({type: 'COMMENT_CREATE_SUCCESS', comment: res}))
    .catch(error => store.dispatch({type: 'COMMENT_CREATE_FAILED', error}));
};
