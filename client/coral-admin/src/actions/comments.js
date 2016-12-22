import coralApi from '../../../coral-framework/helpers/response';
import * as commentActions from '../constants/comments';

// Get comments to fill each of the three lists on the mod queue
export const fetchModerationQueueComments = () => {
  return dispatch => {
    dispatch({type: commentActions.COMMENTS_MODERATION_QUEUE_FETCH});
    return Promise.all([
      coralApi('/queue/comments/pending'),
      coralApi('/comments?status=rejected'),
      coralApi('/comments?action_type=flag')
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
    .then(({comments, users}) => {

      /* Post comments and users to redux store. Actions will be posted when they are needed. */
      dispatch({type: commentActions.USERS_MODERATION_QUEUE_FETCH_SUCCESS, users});
      dispatch({type: commentActions.COMMENTS_MODERATION_QUEUE_FETCH_SUCCESS, comments});

    });
  };
};

// Create a new comment
export const createComment = (name, body, _csrf) => {
  return dispatch => {
    const comment = {body, name, _csrf};
    return coralApi('/comments', {method: 'POST', comment})
      .then(res => dispatch({type: commentActions.COMMENT_CREATE_SUCCESS, comment: res}))
      .catch(error => dispatch({type: commentActions.COMMENT_CREATE_FAILED, error}));
  };
};

/**
 * Action disptacher related to comments
 */

// Update a comment. Now to update a comment we need to send back the whole object
export const updateStatus = (status, comment) => {
  return dispatch => {
    dispatch({type: commentActions.COMMENT_STATUS_UPDATE, id: comment.id, status});
    return coralApi(`/comments/${comment.id}/status`, {method: 'PUT', body: {status}})
      .then(res => dispatch({type: commentActions.COMMENT_UPDATE_SUCCESS, res}))
      .catch(error => dispatch({type: commentActions.COMMENT_UPDATE_FAILED, error}));
  };
};

export const flagComment = id => (dispatch, getState) => {
  dispatch({type: commentActions.COMMENT_FLAG, id});
  dispatch({type: 'COMMENT_UPDATE', comment: getState().comments.get('byId').get(id)});
};

// Dialog Actions
export const showBanUserDialog = (userId, userName, commentId) => {
  return {type: commentActions.SHOW_BANUSER_DIALOG, userId, userName, commentId};
};

export const hideBanUserDialog = (showDialog) => {
  return {type: commentActions.HIDE_BANUSER_DIALOG, showDialog};
};
