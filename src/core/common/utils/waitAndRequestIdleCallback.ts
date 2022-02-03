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
  const supportsIdleCallbacks =
    (window as any).requestIdleCallback && (window as any).cancelIdleCallback;
  let idleCallbackHandle = 0;
  const timeout = setTimeout(() => {
    if (supportsIdleCallbacks) {
      idleCallbackHandle = (window as any).requestIdleCallback(callback);
      return;
    }
    callback();
  }, wait);
  return () => {
    clearTimeout(timeout);
    if (supportsIdleCallbacks) {
      (window as any).cancelIdleCallback(idleCallbackHandle);
    }
  };
}

export default waitAndRequestIdleCallback;
