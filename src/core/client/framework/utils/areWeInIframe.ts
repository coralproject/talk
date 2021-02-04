/**
 * Returns true if we are in an iframe.
 */
export default function areWeInIframe() {
  try {
    // eslint-disable-next-line no-restricted-globals
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
