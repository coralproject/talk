import coralApi from '../../../coral-framework/helpers/response';
import * as userTypes from '../constants/users';

/**
 * Action disptacher related to users
 */
// change status of a user
export const userStatusUpdate = (status, userId, commentId) => {
  return (dispatch) => {
    dispatch({type: userTypes.UPDATE_STATUS_REQUEST});
    return coralApi(`/users/${userId}/status`, {method: 'POST', body: {status: status, comment_id: commentId}})
      .then(res => dispatch({type: userTypes.UPDATE_STATUS_SUCCESS, res}))
      .catch(error => dispatch({type: userTypes.UPDATE_STATUS_FAILURE, error}));
  };
};

// change status of a user
export const sendNotificationEmail = (userId, subject, body) => {
  return (dispatch) => {
    return coralApi(`/users/${userId}/email`, {method: 'POST', body: {subject, body}})
      .catch(error => dispatch({type: userTypes.USER_EMAIL_FAILURE, error}));
  };
};

// let a user edit their username
export const enableUsernameEdit = (userId) => {
  return (dispatch) => {
    return coralApi(`/users/${userId}/username-enable`, {method: 'POST'})
      .catch(error => dispatch({type: userTypes.USERNAME_ENABLE_FAILURE, error}));
  };
};
