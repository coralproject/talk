export default function clearHash() {
  if (window.location.hash) {
    window.history.replaceState(null, document.title, location.pathname);
  }
}
