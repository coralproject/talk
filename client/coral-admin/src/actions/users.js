/**
 * Action disptacher related to users
 */

let rejected = 'rejected';

export const banUser = (status, id, author_id) => (dispatch, getState) => {
  dispatch({type: 'USER_STATUS_UPDATE', id, author_id, status});
  dispatch({type: 'COMMENT_STATUS_UPDATE', id, rejected});
  dispatch({type: 'COMMENT_UPDATE', comment: getState().comments.get('byId').get(id)});
};
