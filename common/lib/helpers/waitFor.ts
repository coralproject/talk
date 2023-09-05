import { setLongTimeout } from "long-settimeout";

/** A promisified timeout. */
export default function waitFor(ms = 0): Promise<void> {
  return new Promise((resolve) => setLongTimeout(resolve, ms));
}
