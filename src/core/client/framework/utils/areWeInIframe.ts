/**
 * Returns true if we are in an iframe.
 */
// eslint-disable-next-line no-restricted-globals
export default function areWeInIframe(window: Window) {
  try {
    // eslint-disable-next-line no-restricted-globals
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
