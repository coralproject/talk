import pym from '../services/PymConnection';

export const addNotification = (notifType, text) => {
  pym.sendMessage('coral-alert', `${notifType}|${text}`);
};

export const clearNotification = () => {
  pym.sendMessage('coral-clear-notification');
};
