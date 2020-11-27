import { Child, MessageCallback } from "pym.js";

import { globalErrorReporter } from "coral-framework/lib/errors";

function onPymMessage(
  child: Child,
  messageType: string,
  callback: MessageCallback
) {
  let disposed = false;
  const wrappedCallback = (message: string) => {
    if (disposed) {
      return;
    }
    callback(message);
  };
  child.onMessage(messageType, wrappedCallback);
  return () => {
    if (disposed) {
      return;
    }
    disposed = true;
    // Dispose next frame to not disrupt pym handling messages.
    setTimeout(() => {
      if (!(messageType in child.messageHandlers)) {
        globalErrorReporter.report(
          `tried to dispose of message handler that didn't exist: ${messageType}`
        );
        return;
      }
      const index = child.messageHandlers[messageType].indexOf(wrappedCallback);
      if (index === -1) {
        globalErrorReporter.report(`Pym message handler already disposed.`);
        return;
      }
      child.messageHandlers[messageType].splice(index, 1);
      if (child.messageHandlers[messageType].length === 0) {
        delete child.messageHandlers[messageType];
      }
    });
  };
}

export default onPymMessage;
