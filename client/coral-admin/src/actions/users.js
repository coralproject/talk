
/**
 * Action disptacher related to users
 */
//
// export const banUser = (status, author_id) => (dispatch) => {
//   dispatch({type: 'USER_STATUS_UPDATE', author_id, status});
// };
export const banUser = (status, userId, commentId) => {
  return dispatch => {
    dispatch({type: 'USER_BAN', status, userId, commentId});
    dispatch({type: 'COMMENTS_MODERATION_QUEUE_FETCH'});
  };
};
