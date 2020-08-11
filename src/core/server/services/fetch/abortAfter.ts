import AbortController from "abort-controller";
import { setLongTimeout } from "long-settimeout";

function abortAfter(ms: number) {
  const controller = new AbortController();
  const timeout = setLongTimeout(() => {
    controller.abort();
  }, ms);

  return { controller, timeout };
}

export default abortAfter;
