import getScrollParent from "./getScrollParent";

/**
 * Ensures that the element is inside the view of first scrollable
 * parent.
 */
export default function ensureInView(element: HTMLElement) {
  // Find scroll parent
  const container = getScrollParent(element);
  if (!container) {
    return;
  }
  // Determine container top and bottom
  const cTop = container.scrollTop;
  const cBottom = cTop + container.clientHeight;

  // Determine element top and bottom
  const eTop = element.offsetTop;
  const eBottom = eTop + element.clientHeight;

  // Check if out of view
  if (eTop < cTop) {
    container.scrollTop -= cTop - eTop;
  } else if (eBottom > cBottom) {
    container.scrollTop += eBottom - cBottom;
  }
}
