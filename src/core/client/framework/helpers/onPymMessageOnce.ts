import { Child, MessageCallback } from "pym.js";

import onPymMessage from "./onPymMessage";

function onPymMessageOnce(
  pym: Child,
  messageType: string,
  callback: MessageCallback
) {
  const dispose = onPymMessage(pym, messageType, (raw) => {
    callback(raw);
    dispose();
  });
  return dispose;
}

export default onPymMessageOnce;
