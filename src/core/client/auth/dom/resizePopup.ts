export default function resizePopup() {
  const innerHeight = window.document.body.offsetHeight;
  window.resizeTo(
    window.outerWidth,
    innerHeight + window.outerHeight - window.innerHeight
  );
}
