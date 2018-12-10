/**
 * Loads intersection-observer polyfill if it doesn't exist.
 */
export default async function ensurePolyfill() {
  if (!(window as any).IntersectionObserver) {
    await import("intersection-observer");
  }
  return;
}
