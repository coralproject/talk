/**
 * Action disptacher related to users
 */

export const updateUserStatus = (status, id) => (dispatch, getState) => {
  dispatch({type: 'USER_STATUS_UPDATE', id, status});
  dispatch({type: 'USER_UPDATE', user: getState().comments.get('byId').get(id)});
};
