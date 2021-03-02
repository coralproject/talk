export default function clearHash(window: Window) {
  if (window.location.hash) {
    window.history.replaceState(null, window.document.title, location.pathname);
  }
}
