import { COUNT_SELECTOR } from "coral-framework/constants";

type GetCountFunction = (opts?: { reset?: boolean }) => void;

/** Injects a global CoralCount callback into the window object to be used in JSONP */
function injectJSONPCallback(getCount: GetCountFunction) {
  (window as any).CoralCount = {
    setCount: (data: { ref: string; html: string; count?: number }) => {
      // Find all the elements with ref.
      const elements = document.querySelectorAll(
        `${COUNT_SELECTOR}[data-coral-ref='${data.ref}']`
      );
      Array.prototype.forEach.call(elements, (element: HTMLElement) => {
        element.innerHTML = data.html;

        // Because this involves a new field being added to the JSONP response,
        // we check that the field is available and is a number before we add
        // it.
        // TODO: (wyattjoh) remove after 6.3.1
        if (data.count !== undefined && typeof data.count === "number") {
          element.dataset.coralCount = data.count.toString();
        }
      });
    },
    getCount,
  };
}

export default injectJSONPCallback;
