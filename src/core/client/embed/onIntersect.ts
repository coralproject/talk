// Polyfill intersection observer.
import "intersection-observer";
export type OnIntersectCancellation = () => void;

export default function onIntersect(
  el: HTMLElement,
  callback: () => void
): OnIntersectCancellation {
  const options = {
    rootMargin: "100px",
    threshold: 1.0,
  };

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      observer.disconnect();
      callback();
    }
  }, options);
  observer.observe(el);
  return () => observer.disconnect();
}
