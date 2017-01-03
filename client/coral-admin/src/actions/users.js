import coralApi from '../../../coral-framework/helpers/response';
import * as userTypes from '../constants/users';

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
