import { Child, MessageCallback } from "pym.js";

function onPymMessage(
  child: Child,
  messageType: string,
  callback: MessageCallback
) {
  child.onMessage(messageType, callback);
  return () => {
    const index = child.messageHandlers[messageType].indexOf(callback);
    if (index > -1) {
      child.messageHandlers[messageType].splice(index, 1);
      if (child.messageHandlers[messageType].length === 0) {
        delete child.messageHandlers[messageType];
      }
    }
  };
}

export default onPymMessage;
