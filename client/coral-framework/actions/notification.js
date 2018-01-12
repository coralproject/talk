import * as actions from '../constants/notification';

export const notify = (kind, msg) => (dispatch, _, { notification }) => {
  const messages = Array.isArray(msg) ? msg : [msg];

  messages.forEach(message => {
    switch (kind) {
      case 'error':
        notification.error(message);
        break;
      case 'info':
        notification.info(message);
        break;
      case 'success':
        notification.success(message);
        break;
      default:
        throw new Error(`Unknown notification kind ${kind}`);
    }
    dispatch({ type: actions.NOTIFY, kind, message });
  });
};
