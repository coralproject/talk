/**
 * Extract contentBoxSize from ResizeObserverEntry across browsers.
 */
function getContentBoxSize(
  entry: ResizeObserverEntry
): { blockSize: number; inlineSize: number } | null {
  const entryAny = entry as any;
  if (entryAny.contentBoxSize) {
    return Array.isArray(entryAny.contentBoxSize)
      ? entryAny.contentBoxSize[0]
      : // Firefox implements `contentBoxSize` as a single content rect, rather than an array
        (entryAny.contentBoxSize as unknown as any);
  }
  // Support older `contentRect` prop.
  if (entryAny.contentRect) {
    return {
      inlineSize: entryAny.contentRect.width,
      blockSize: entryAny.contentRect.height,
    };
  }
  return null;
}

export default getContentBoxSize;
