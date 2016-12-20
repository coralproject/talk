import coralApi from '../../../coral-framework/helpers/response';

/**
 * Action disptacher related to users
 */
// export const banUser = (status, userId, commentId) => {
//   return dispatch => {
//     dispatch({type: 'USER_BAN', status, userId, commentId});
//     dispatch({type: 'COMMENTS_MODERATION_QUEUE_FETCH'});
//   };
// };

// change status of a user
export const userStatusUpdate = (status, userId, commentId) => {
  return dispatch => {
    return coralApi(`/users/${userId}/status`, {method: 'POST', body: {status: status, comment_id: commentId}})
      .then(res => dispatch({type: 'USER_BAN_SUCESS', res}))
      .catch(error => dispatch({type: 'USER_BAN_FAILED', error}));
  };
};
