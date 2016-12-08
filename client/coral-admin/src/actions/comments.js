/**
 * Action disptacher related to comments
 */

export const updateStatus = (status, id) => (dispatch, getState) => {
  dispatch({type: 'COMMENT_STATUS_UPDATE', id, status});
  dispatch({type: 'COMMENT_UPDATE', comment: getState().comments.get('byId').get(id)});
};

export const flagComment = id => (dispatch, getState) => {
  dispatch({type: 'COMMENT_FLAG', id});
  dispatch({type: 'COMMENT_UPDATE', comment: getState().comments.get('byId').get(id)});
};

export const createComment = (name, body) => dispatch => {
  dispatch({type: 'COMMENT_CREATE', name, body});
};

// Dialog Actions
export const showBanUserDialog = (userId, userName, commentId) => {
  return dispatch => {
    dispatch({type: 'SHOW_BANUSER_DIALOG', userId, userName, commentId});
  };
};

export const hideBanUserDialog = (showDialog) => {
  return dispatch => {
    dispatch({type: 'HIDE_BANUSER_DIALOG', showDialog});
  };
};

export const banUser = (status, userId, commentId) => {
  return dispatch => {
    dispatch({type: 'USER_BAN', status, userId, commentId});
    dispatch({type: 'COMMENTS_MODERATION_QUEUE_FETCH'});
  };
};
