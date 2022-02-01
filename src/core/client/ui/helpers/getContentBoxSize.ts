/**
 * Extract contentBoxSize from ResizeObserverEntry across browsers.
 */
function getContentBoxSize(
  entry: ResizeObserverEntry
): { blockSize: number; inlineSize: number } {
  const entryAny = entry as any;
  return Array.isArray(entryAny.contentBoxSize)
    ? entryAny.contentBoxSize[0]
    : // Firefox implements `contentBoxSize` as a single content rect, rather than an array
      ((entryAny.contentBoxSize as unknown) as any);
}

export default getContentBoxSize;
