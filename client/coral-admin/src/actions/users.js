import coralApi from '../../../coral-framework/helpers/response';
import * as userTypes from '../constants/user';
import * as actionTypes from '../constants/actions';

/**
 * Action disptacher related to users
 */
// change status of a user
export const userStatusUpdate = (status, userId, commentId) => {
  return dispatch => {
    dispatch({type: userTypes.UPDATE_STATUS_REQUEST});
    return coralApi(`/users/${userId}/status`, {method: 'POST', body: {status: status, comment_id: commentId}})
      .then(res => dispatch({type: userTypes.UPDATE_STATUS_SUCCESS, res}))
      .catch(error => dispatch({type: userTypes.UPDATE_STATUS_FAILURE, error}));
  };
};

// Get users to add to the mod queue
export const fetchModerationQueueUsers = () => {
  return dispatch => {
    dispatch({type: userTypes.USERS_MODERATION_QUEUE_FETCH_REQUEST});
    return coralApi('/queue/comments/pending')
      .then(({users, actions}) => {

        /* Post users and actions to redux store. Actions will be posted when they are needed. */
        dispatch({type: userTypes.USERS_MODERATION_QUEUE_FETCH_SUCCESS, users});
        dispatch({type: actionTypes.ACTIONS_MODERATION_QUEUE_FETCH_SUCCESS, actions});
      })
      .catch(error => dispatch({type: userTypes.USERS_MODERATION_QUEUE_FETCH_FAILURE, error}));
  };
};
