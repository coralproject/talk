import AbortController from "abort-controller";

function abortAfter(ms: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, ms);

  return { controller, timeout };
}

export default abortAfter;
