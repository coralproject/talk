import { setLongTimeout } from "long-settimeout";

/** A promisified timeout. */
export default function timeout(ms = 0) {
  return new Promise((resolve) => setLongTimeout(resolve, ms));
}
