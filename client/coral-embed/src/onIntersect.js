export default function onIntersect(el, callback) {
  if (!IntersectionObserver) {
    // tslint:disable-next-line:no-console
    console.warn('IntersectionObserver not available');
    callback();
    return;
  }
  const options = {
    rootMargin: '100px',
    threshold: 1.0,
  };

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      observer.disconnect();
      callback();
    }
  }, options);
  observer.observe(el);
}
