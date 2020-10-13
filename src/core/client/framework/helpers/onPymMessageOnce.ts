import { Child, MessageCallback } from "pym.js";

import onPymMessage from "./onPymMessage";

function onPymMessageOnce(
  pym: Child,
  messageType: string,
  callback: MessageCallback
) {
  const dispose = onPymMessage(pym, messageType, (raw) => {
    callback(raw);
    // Dispose next frame to not disrupt pym handling messages.
    setTimeout(() => dispose());
  });
  return dispose;
}

export default onPymMessageOnce;
