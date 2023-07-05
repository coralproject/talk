/** A promisified animation frame. */
export default function animationFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}
