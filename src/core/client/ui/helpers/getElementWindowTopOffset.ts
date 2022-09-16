/**
 * Get elements top offset relative to the window.
 */
function getElementWindowTopOffset(
  window: Window | React.RefObject<any>["current"],
  element: Element
) {
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  return element.getBoundingClientRect().top + window.scrollY;
}

export default getElementWindowTopOffset;
