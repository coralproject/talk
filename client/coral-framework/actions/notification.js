import pym from '../services/PymConnection';
import * as actions from '../constants/notification';

export const addNotification = (notifType, text) => {
  pym.sendMessage('coral-alert', `${notifType}|${text}`);
  return {type: actions.ADD_NOTIFICATION, notifType, text};
};

export const clearNotification = () => {
  pym.sendMessage('coral-clear-notification');
  return {type: actions.CLEAR_NOTIFICATION};
};
