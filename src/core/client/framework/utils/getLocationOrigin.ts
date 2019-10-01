export default function getLocationOrigin() {
  return (
    location.origin || `${window.location.protocol}//${window.location.host}`
  );
}
