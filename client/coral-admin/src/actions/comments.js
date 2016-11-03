
/**
 * Action disptacher related to comments
 */

export const updateStatus = (status, id) => (dispatch, getState) => {
  dispatch({ type: 'COMMENT_STATUS_UPDATE', id, status })
  dispatch({ type: 'COMMENT_UPDATE', comment: getState().comments.get('byId').get(id) })
}

export const flagComment = id => (dispatch, getState) => {
  dispatch({ type: 'COMMENT_FLAG', id })
  dispatch({ type: 'COMMENT_UPDATE', comment: getState().comments.get('byId').get(id) })
}

export const createComment = (name, body) => dispatch => {
  dispatch({ type: 'COMMENT_CREATE', name, body })
}
