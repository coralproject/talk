import { SCOPE, ORIGIN } from './constants';

export default (name, data, target = window.opener) => {
  if (!target) {
    return;
  }

  // Serialize the message to be sent via postMessage.
  const msg = { name, data, scope: SCOPE };

  // Send the message.
  target.postMessage(msg, ORIGIN);
};
