/**
 * Function decorator that prevents calling `fn` more then once per frame.
 * If called more than once, the last return value gets returned.
 */
const oncePerFrame = <T extends (...args: any[]) => any>(
  fn: T,
  toggledThisFrame: boolean,
  setToggledThisFrame: (toggled: boolean) => void
) => {
  let lastResult: any = null;
  return ((...args: any[]) => {
    if (toggledThisFrame) {
      return lastResult;
    }
    setToggledThisFrame(true);
    lastResult = fn(...args);
    setTimeout(() => setToggledThisFrame(false), 0);
  }) as T;
};

export default oncePerFrame;
