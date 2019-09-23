function resizePopup() {
  const innerHeight = window.document.body.offsetHeight;
  window.resizeTo(350, innerHeight + window.outerHeight - window.innerHeight);
}

let resizedAlready = false;
export default function resizeOncePerFrame() {
  if (resizedAlready) {
    return;
  }
  resizedAlready = true;
  requestAnimationFrame(() => setTimeout(() => (resizedAlready = false), 0));
  resizePopup();
}
