interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const intersection = (r1: Rect, r2: Rect) => {
  const xOverlap = Math.max(
    0,
    Math.min(r1.x + r1.w, r2.x + r2.w) - Math.max(r1.x, r2.x)
  );
  const yOverlap = Math.max(
    0,
    Math.min(r1.y + r1.h, r2.y + r2.h) - Math.max(r1.y, r2.y)
  );
  const overlapArea = xOverlap * yOverlap;

  return overlapArea;
};

// From https://stackoverflow.com/questions/64564266/check-if-a-piece-of-the-element-is-in-viewport
const percentInView = (el: Element, window: Window) => {
  const rect = el.getBoundingClientRect();

  const dimension: Rect = {
    x: rect.x,
    y: rect.y,
    w: rect.width,
    h: rect.height,
  };
  const viewport: Rect = {
    x: 0,
    y: 0,
    w: window.innerWidth,
    h: window.innerHeight,
  };
  const divsize = dimension.w * dimension.h;
  const overlap = intersection(dimension, viewport);

  return overlap / divsize;
};

/**
 * Return whether or not element is intersecting with window.
 */
export default function isElementIntersecting(el: Element, window: Window) {
  return percentInView(el, window) > 0;
}
