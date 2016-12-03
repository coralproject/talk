
/**
 * Action disptacher related to users
 */

export const banUser = (status, id, author_id) => (dispatch) => {
  dispatch({type: 'USER_STATUS_UPDATE', id, author_id, status});
};
