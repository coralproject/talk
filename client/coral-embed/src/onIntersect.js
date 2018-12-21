export default function onIntersect(el, callback) {
  // Ensure that the intersection observer is available.
  if (!IntersectionObserver) {
    // tslint:disable-next-line:no-console
    window.console.warn('IntersectionObserver not available, rendering now');
    callback();
    return;
  }

  // Create the Intersection Observer that will wait till the embed is within
  // view and will then call the callback.
  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        // Stop receiving intersection events.
        observer.disconnect();

        // Fire the callback.
        callback();
      }
    },
    {
      rootMargin: '100px',
      threshold: 1.0,
    }
  );

  // Start observing the element for visibility.
  observer.observe(el);
}
