/**
 * Returns true if we are in an iframe.
 */
export default function areWeInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
