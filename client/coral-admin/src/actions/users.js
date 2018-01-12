import * as userTypes from '../constants/users';
import t from 'coral-framework/services/i18n';

/**
 * Action disptacher related to users
 */
// change status of a user
export const userStatusUpdate = (status, userId, commentId) => {
  return (dispatch, _, { rest }) => {
    dispatch({ type: userTypes.UPDATE_STATUS_REQUEST });
    return rest(`/users/${userId}/status`, {
      method: 'POST',
      body: { status: status, comment_id: commentId },
    })
      .then(res => dispatch({ type: userTypes.UPDATE_STATUS_SUCCESS, res }))
      .catch(error => {
        console.error(error);
        const errorMessage = error.translation_key
          ? t(`error.${error.translation_key}`)
          : error.toString();
        dispatch({
          type: userTypes.UPDATE_STATUS_FAILURE,
          error: errorMessage,
        });
      });
  };
};

// change status of a user
export const sendNotificationEmail = (userId, subject, body) => {
  return (dispatch, _, { rest }) => {
    return rest(`/users/${userId}/email`, {
      method: 'POST',
      body: { subject, body },
    }).catch(error => {
      console.error(error);
      const errorMessage = error.translation_key
        ? t(`error.${error.translation_key}`)
        : error.toString();
      dispatch({ type: userTypes.USER_EMAIL_FAILURE, error: errorMessage });
    });
  };
};

// let a user edit their username
export const enableUsernameEdit = userId => {
  return (dispatch, _, { rest }) => {
    return rest(`/users/${userId}/username-enable`, { method: 'POST' }).catch(
      error => {
        console.error(error);
        const errorMessage = error.translation_key
          ? t(`error.${error.translation_key}`)
          : error.toString();
        dispatch({
          type: userTypes.USERNAME_ENABLE_FAILURE,
          error: errorMessage,
        });
      }
    );
  };
};
