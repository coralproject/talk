import * as actions from '../constants/notification';

export const notify = (kind, msg) => (dispatch, _, {notification}) => {
  switch (kind) {
  case 'error':
    notification.error(msg);
    break;
  case 'info':
    notification.info(msg);
    break;
  case 'success':
    notification.success(msg);
    break;
  default:
    throw new Error(`Unknown notification kind ${kind}`);
  }
  dispatch({type: actions.NOTIFY, kind, msg});
};
