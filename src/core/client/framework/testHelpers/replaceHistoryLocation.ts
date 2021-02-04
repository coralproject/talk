/* eslint-disable no-restricted-globals */
type RestoreHistoryFunction = () => void;

export default function replaceHistoryLocation(
  location: string
): RestoreHistoryFunction {
  const previousState = window.history.state;
  const previousLocation = location.toString();
  window.history.replaceState(previousState, document.title, location);
  return () =>
    window.history.replaceState(
      previousState,
      document.title,
      previousLocation
    );
}
