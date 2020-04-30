function resizePopup() {
  const innerHeight = window.document.body.offsetHeight;

  try {
    window.resizeTo(
      350,
      innerHeight + window.outerHeight - window.innerHeight + 10
    );
  } catch {
    // Ignore occasional errors in IE11.
  }
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
