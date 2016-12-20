import coralApi from '../../../coral-framework/helpers/response';
import * as actions from '../constants/comments';


// Get comments to fill each of the three lists on the mod queue
export const fetchModerationQueueComments = () => {
  return dispatch => {

    return Promise.all([
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
      dispatch({type: actions.USERS_MODERATION_QUEUE_FETCH_SUCCESS,
        users: all.users});
      dispatch({type: actions.COMMENTS_MODERATION_QUEUE_FETCH_SUCCESS,
        comments: all.comments});

    });
  };
};


// .catch(error => store.dispatch({type: 'COMMENTS_MODERATION_QUEUE_FETCH_FAILED', error}));

// Update a comment. Now to update a comment we need to send back the whole object

export const updateComment = (store, comment) => {
  coralApi(`/comments/${comment.get('id')}/status`, {method: 'PUT', body: {status: comment.get('status')}})
  .then(res => store.dispatch({type: 'COMMENT_UPDATE_SUCCESS', res}))
  .catch(error => store.dispatch({type: 'COMMENT_UPDATE_FAILED', error}));
};

// Create a new comment
export const createComment = (name, body) => {
  return dispatch => {
    const comment = {
      status: 'Untouched',
      body,
      name
    };
    return coralApi('/comments', {method: 'POST', comment})
      .then(res => dispatch({type: actions.COMMENT_CREATE_SUCCESS, comment: res}))
      .catch(error => dispatch({type: actions.COMMENT_CREATE_FAILED, error}));
  };
};


/**
 * Action disptacher related to comments
 */

export const updateStatus = (status, id) => (dispatch, getState) => {
  dispatch({type: 'COMMENT_STATUS_UPDATE', id, status});
  dispatch({type: 'COMMENT_UPDATE', comment: getState().comments.get('byId').get(id)});
};

export const flagComment = id => (dispatch, getState) => {
  dispatch({type: 'COMMENT_FLAG', id});
  dispatch({type: 'COMMENT_UPDATE', comment: getState().comments.get('byId').get(id)});
};

// Dialog Actions
export const showBanUserDialog = (userId, userName, commentId) => {
  return dispatch => {
    dispatch({type: 'SHOW_BANUSER_DIALOG', userId, userName, commentId});
  };
};

export const hideBanUserDialog = (showDialog) => {
  return dispatch => {
    dispatch({type: 'HIDE_BANUSER_DIALOG', showDialog});
  };
};
