/**
 * Action disptacher related to users
 */

export const updateUserStatus = (status, id) => (dispatch, getState) => {
  console.log('DEBUG ', getState);
  dispatch({type: 'USER_STATUS_UPDATE', id, status});
};
