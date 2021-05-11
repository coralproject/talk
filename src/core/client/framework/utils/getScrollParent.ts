/**
 * Find and return first scrollable parent.
 */
export default function getScrollParent(
  node: HTMLElement | null
): HTMLElement | null {
  if (node === null) {
    return null;
  }

  const overflowY = window.getComputedStyle(node).overflowY;
  const isScrollable = overflowY !== "visible" && overflowY !== "hidden";

  if (isScrollable && node.scrollHeight > node.clientHeight) {
    return node;
  } else {
    return getScrollParent(node.parentNode as HTMLElement);
  }
}
