import onIntersectChange, {
  OnIntersectCancellation,
} from "./onIntersectChange";
export { OnIntersectCancellation } from "./onIntersectChange";

export default function onIntersect(
  el: HTMLElement,
  callback: () => void,
  options?: IntersectionObserverInit
): OnIntersectCancellation {
  const disconnect = onIntersectChange(
    el,
    (isIntersecting) => {
      if (isIntersecting) {
        disconnect();
        callback();
      }
    },
    options
  );
  return disconnect;
}
