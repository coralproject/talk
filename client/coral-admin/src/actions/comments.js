import coralApi from '../../../coral-framework/helpers/response';
import * as commentTypes from '../constants/comments';
import * as actionTypes from '../constants/actions';

function addUsersCommentsActions (dispatch, {comments, users, actions}) {
  dispatch({type: commentTypes.USERS_MODERATION_QUEUE_FETCH_SUCCESS, users});
  dispatch({type: commentTypes.COMMENTS_MODERATION_QUEUE_FETCH_SUCCESS, comments});
  dispatch({type: actionTypes.ACTIONS_MODERATION_QUEUE_FETCH_SUCCESS, actions});
}

// Get comments to fill each of the three lists on the mod queue
export const fetchModerationQueueComments = () => {
  return dispatch => {
    dispatch({type: commentTypes.COMMENTS_MODERATION_QUEUE_FETCH_REQUEST});

    return Promise.all([
      coralApi('/queue/comments/pending'),
      coralApi('/queue/comments/rejected'),
      coralApi('/queue/comments/flagged')
    ])
    .then(([pending, rejected, flagged]) => {

      /* Combine seperate calls into a single object */
      flagged.comments.forEach(comment => comment.flagged = true);
      return {
        comments: [...pending.comments, ...rejected.comments, ...flagged.comments],
        users: [...pending.users, ...rejected.users, ...flagged.users],
        actions: [...pending.actions, ...rejected.actions, ...flagged.actions]
      };
    })
    .then(addUsersCommentsActions.bind(this, dispatch));
  };
};

export const fetchPendingQueue = () => {
  return dispatch => {
    dispatch({type: commentTypes.COMMENTS_MODERATION_QUEUE_FETCH_REQUEST});

    return coralApi('/queue/comments/pending')
      .then(addUsersCommentsActions.bind(this, dispatch));
  };
};

export const fetchRejectedQueue = () => {
  return dispatch => {
    dispatch({type: commentTypes.COMMENTS_MODERATION_QUEUE_FETCH_REQUEST});

    return coralApi('/queue/comments/rejected')
      .then(addUsersCommentsActions.bind(this, dispatch));
  };
};

export const fetchFlaggedQueue = () => {
  return dispatch => {
    dispatch({type: commentTypes.COMMENTS_MODERATION_QUEUE_FETCH_REQUEST});

    return coralApi('/queue/comments/flagged')
      .then(comments => {
        comments.forEach(comment => comment.flagged = true);
        return comments;
      })
      .then(addUsersCommentsActions.bind(this, dispatch));
  };
};

// Create a new comment
export const createComment = (name, body) => {
  return (dispatch) => {
    const formData = {body, name};
    return coralApi('/comments', {method: 'POST', body: formData})
      .then(res => dispatch({type: commentTypes.COMMENT_CREATE_SUCCESS, comment: res}))
      .catch(error => dispatch({type: commentTypes.COMMENT_CREATE_FAILED, error}));
  };
};

/**
 * Action disptacher related to comments
 */

// Update a comment. Now to update a comment we need to send back the whole object
export const updateStatus = (status, comment) => {
  return dispatch => {
    dispatch({type: commentTypes.COMMENT_STATUS_UPDATE_REQUEST, id: comment.id, status});
    return coralApi(`/comments/${comment.id}/status`, {method: 'PUT', body: {status}})
      .then(res => dispatch({type: commentTypes.COMMENT_STATUS_UPDATE_SUCCESS, res}))
      .catch(error => dispatch({type: commentTypes.COMMENT_STATUS_UPDATE_FAILURE, error}));
  };
};

export const flagComment = id => (dispatch, getState) => {
  dispatch({type: commentTypes.COMMENT_FLAG, id});
  dispatch({type: 'COMMENT_UPDATE', comment: getState().comments.get('byId').get(id)});
};

// Dialog Actions
export const showBanUserDialog = (userId, userName, commentId) => {
  return {type: commentTypes.SHOW_BANUSER_DIALOG, userId, userName, commentId};
};

export const hideBanUserDialog = (showDialog) => {
  return {type: commentTypes.HIDE_BANUSER_DIALOG, showDialog};
};
