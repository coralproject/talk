import coralApi from '../../../coral-framework/helpers/response';
import * as actions from '../constants/user';

/**
 * Action disptacher related to users
 */
// change status of a user
export const userStatusUpdate = (status, userId, commentId) => {
  return dispatch => {
    dispatch({type: actions.UPDATE_STATUS_REQUEST});
    return coralApi(`/users/${userId}/status`, {method: 'POST', body: {status: status, comment_id: commentId}})
      .then(res => dispatch({type: actions.UPDATE_STATUS_SUCCESS, res}))
      .catch(error => dispatch({type: actions.UPDATE_STATUS_FAILURE, error}));
  };
};
