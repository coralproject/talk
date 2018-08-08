/**
 * Function decorator that prevents calling `fn` more then once per frame.
 * If called more than once, the last return value gets returned.
 */
const oncePerFrame = <T extends (...args: any[]) => any>(fn: T) => {
  let toggledThisFrame = false;
  let lastResult: any = null;
  return ((...args: any[]) => {
    if (toggledThisFrame) {
      return lastResult;
    }
    toggledThisFrame = true;
    lastResult = fn(...args);
    setTimeout(() => (toggledThisFrame = false), 0);
  }) as T;
};

export default oncePerFrame;
