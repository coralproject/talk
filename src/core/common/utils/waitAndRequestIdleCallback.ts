/* eslint-disable no-restricted-globals */
export type Cancel = () => void;

/**
 * This function waits given number of ms and
 * requests an idle frame to call the callback.
 */
function waitAndRequestIdleCallback(
  callback: () => void,
  wait: number
): Cancel {
  let idleCallbackHandle = 0;
  const timeout = setTimeout(() => {
    if ("requestIdleCallback" in window) {
      idleCallbackHandle = (window as any).requestIdleCallback(callback);
      return;
    }
    callback();
  }, wait);
  return () => {
    clearTimeout(timeout);
    if (idleCallbackHandle) {
      (window as any).cancelIdleCallback(idleCallbackHandle);
    }
  };
}

export default waitAndRequestIdleCallback;
