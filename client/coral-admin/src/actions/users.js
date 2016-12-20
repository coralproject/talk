import coralApi from '../../../coral-framework/helpers/response';

/**
 * Action disptacher related to users
 */
// change status of a user
export const userStatusUpdate = (status, userId, commentId) => {
  return dispatch => {
    return coralApi(`/users/${userId}/status`, {method: 'POST', body: {status: status, comment_id: commentId}})
      .then(res => dispatch({type: 'USER_BAN_SUCESS', res}))
      .catch(error => dispatch({type: 'USER_BAN_FAILED', error}));
  };
};
