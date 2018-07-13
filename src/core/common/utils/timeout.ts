/** A promisified timeout. */
export default function timeout(ms: number = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
