import { globalErrorReporter } from "coral-framework/lib/errors/reporter/globalErrorReporter";

import getContentBoxSize from "../helpers/getContentBoxSize";
import getShadowRootWidth from "./getShadowRootWidth";

export type ShadowRootWidthChangeCallback = (width: number | null) => void;
interface ShadowRootWidthObserverMapValue {
  callbacks: ShadowRootWidthChangeCallback[];
  width: number | null;
  resizeObserver: ResizeObserver;
}

const ShadowRootWidthObserverMap = new WeakMap<
  ShadowRoot,
  ShadowRootWidthObserverMapValue
>();

/**
 * create observer callback that checks shadow root width for changes
 */
const createObserve =
  (shadowRoot: ShadowRoot): ResizeObserverCallback =>
  (entries) => {
    if (entries.length > 1) {
      throw new Error("Not expected length to be > 1");
    }
    const entry = entries[0];
    const contentBoxSize = getContentBoxSize(entry);

    if (contentBoxSize === null) {
      // eslint-disable-next-line no-console
      console.warn("ResizeObserver contains invalid `contentBoxSize`", entries);
      globalErrorReporter.report(
        `ResizeObserver contains invalid contentBoxSize`
      );
      return;
    }

    const newWidth = contentBoxSize.inlineSize;

    const val = ShadowRootWidthObserverMap.get(shadowRoot);
    if (!val) {
      return;
    }
    if (val.width !== newWidth) {
      val.width = newWidth;
      // Width change detected, call callbacks.
      val.callbacks.forEach((cb) => cb(val.width));
    }
  };

/**
 * Calls `callback` whenever a width change has been detected on `shadowRoot`.
 * This uses a shared ResziseObserver per ShadowRoot.
 */
export default function onShadowRootWidthChange(
  shadowRoot: ShadowRoot,
  callback: ShadowRootWidthChangeCallback
): () => void {
  if (!ShadowRootWidthObserverMap.has(shadowRoot)) {
    // eslint-disable-next-line no-restricted-globals
    const resizeObserver = new (window as any).ResizeObserver(
      createObserve(shadowRoot)
    );
    ShadowRootWidthObserverMap.set(shadowRoot, {
      callbacks: [],
      width: getShadowRootWidth(shadowRoot),
      resizeObserver,
    });
    resizeObserver.observe(shadowRoot.firstChild! as Element);
  }
  const value = ShadowRootWidthObserverMap.get(shadowRoot)!;
  const shadowRootFirstChild = shadowRoot.firstChild;
  const array = value.callbacks;
  array.push(callback);

  // Call with initial width.
  callback(value.width);

  return () => {
    const index = array.indexOf(callback);
    if (index > -1) {
      array.splice(index, 1);
      if (array.length === 0) {
        value.resizeObserver.unobserve(shadowRootFirstChild as Element);
        ShadowRootWidthObserverMap.delete(shadowRoot);
      }
    }
  };
}
