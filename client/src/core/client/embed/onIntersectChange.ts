export type OnIntersectCancellation = () => void;

export default function onIntersectChange(
  el: HTMLElement,
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverInit
): OnIntersectCancellation {
  const observer = new IntersectionObserver((entries) => {
    callback(entries[0].isIntersecting);
  }, options);
  observer.observe(el);
  return () => observer.disconnect();
}
