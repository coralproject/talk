/* Notification Actions */

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';

export const addNotification = (notifType, text) => {
  return {
    type: ADD_NOTIFICATION,
    notifType,
    text
  };
};

export const clearNotification = () => {
  return {
    type: CLEAR_NOTIFICATION
  };
};
