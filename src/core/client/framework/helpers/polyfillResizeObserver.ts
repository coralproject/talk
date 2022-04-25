/* eslint-disable no-restricted-globals */
import ResizeObserver from "resize-observer-polyfill";

if ("ResizeObserver" in window === false) {
  (window as any).ResizeObserver = ResizeObserver;
}
