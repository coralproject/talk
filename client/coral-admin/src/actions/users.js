/**
 * Action disptacher related to users
 */

export const updateUserStatus = (status, id) => (dispatch) => {
  dispatch({type: 'USER_STATUS_UPDATE', id, status});
};
