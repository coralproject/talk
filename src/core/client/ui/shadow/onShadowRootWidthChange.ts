import getShadowRootWidth from "./getShadowRootWidth";

/** Interval for checking changes in the result of the mediaquery inside a shadow dom */
const SHADOW_MATCHMEDIA_POLLING_INTERVAL = 500;

export type ShadowRootWidthChangeCallback = (width: number | null) => void;
interface ShadowRootWidthObserverMapValue {
  callbacks: ShadowRootWidthChangeCallback[];
  width: number | null;
}

const ShadowRootWidthObserverMap = new WeakMap<
  ShadowRoot,
  ShadowRootWidthObserverMapValue
>();

/**
 * start observer loop that checks shadow root width for changes and
 * stops when no callbacks were found in the map.
 */
function startShadowRootWidthObserver(shadowRoot: ShadowRoot) {
  const runObserve = () => {
    const checkCallback = () => {
      const val = ShadowRootWidthObserverMap.get(shadowRoot);
      if (!val) {
        return;
      }
      if (val.callbacks.length === 0) {
        ShadowRootWidthObserverMap.delete(shadowRoot);
        return;
      }
      const newWidth = getShadowRootWidth(shadowRoot);
      if (val.width !== newWidth) {
        val.width = newWidth;
        val.callbacks.forEach((cb) => cb(val.width));
      }
      runObserve();
    };
    setTimeout(() => {
      // eslint-disable-next-line no-restricted-globals
      if ("requestIdleCallback" in window) {
        // eslint-disable-next-line no-restricted-globals
        (window as any).requestIdleCallback(checkCallback);
      } else {
        requestAnimationFrame(checkCallback);
      }
    }, SHADOW_MATCHMEDIA_POLLING_INTERVAL);
  };
  runObserve();
}

/**
 * Calls `callback` whenever a width change has been detected on `shadowRoot`.
 * This is highly optimized and runs only one polling loop per `shadowRoot` instance.
 */
export default function onShadowRootWidthChange(
  shadowRoot: ShadowRoot,
  callback: ShadowRootWidthChangeCallback
): () => void {
  if (!ShadowRootWidthObserverMap.has(shadowRoot)) {
    ShadowRootWidthObserverMap.set(shadowRoot, {
      callbacks: [],
      width: getShadowRootWidth(shadowRoot),
    });
    // We start the match checker loop.
    startShadowRootWidthObserver(shadowRoot);
  }
  const array = ShadowRootWidthObserverMap.get(shadowRoot)!.callbacks;
  array.push(callback);

  return () => {
    const index = array.indexOf(callback);
    if (index > -1) {
      array.splice(index, 1);
    }
  };
}
