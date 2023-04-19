/**
 * Get elements top offset relative to the window.
 */
function getElementWindowTopOffset(window: Window, element: Element) {
  return element.getBoundingClientRect().top + window.scrollY;
}

export default getElementWindowTopOffset;
