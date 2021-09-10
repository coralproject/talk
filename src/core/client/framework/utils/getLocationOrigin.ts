export default function getLocationOrigin(window: Window) {
  return (
    window.location.origin ||
    `${window.location.protocol}//${window.location.host}`
  );
}
