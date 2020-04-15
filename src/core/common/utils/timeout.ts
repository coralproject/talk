/** A promisified timeout. */
export default function timeout(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
