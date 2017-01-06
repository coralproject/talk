import coralApi from '../../../coral-framework/helpers/response';
import * as userTypes from '../constants/users';

/**
 * Action disptacher related to users
 */
// change status of a user
export const userStatusUpdate = (status, userId, commentId) => {
  return (dispatch, getState) => {
    dispatch({type: userTypes.UPDATE_STATUS_REQUEST});
    const _csrf = getState().auth.get('_csrf');
    return coralApi(`/users/${userId}/status`, {method: 'POST', body: {status: status, comment_id: commentId}, _csrf})
      .then(res => dispatch({type: userTypes.UPDATE_STATUS_SUCCESS, res}))
      .catch(error => dispatch({type: userTypes.UPDATE_STATUS_FAILURE, error}));
  };
};

// change status of a user
export const sendNotificationEmail = (userId, subject, text) => {
  return (dispatch, getState) => {
    const _csrf = getState().auth.get('_csrf');
    return coralApi(`/users/${userId}/email`, {method: 'POST', body: {subject, text}, _csrf})
      .catch(error => dispatch({type: userTypes.USER_EMAIL_FAILURE, error}));
  };
};
