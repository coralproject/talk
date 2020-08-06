import { setLongTimeout } from "long-settimeout";

function createTimeoutAt(callback: () => void, timeoutAt: string) {
  const diff = new Date(timeoutAt).valueOf() - Date.now();
  if (diff > 0) {
    return setLongTimeout(callback, diff);
  }

  return null;
}

export default createTimeoutAt;
