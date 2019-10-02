import { COUNT_SELECTOR } from "coral-framework/constants";

/** Injects a global CoralCount callback into the window object to be used in JSONP */
function injectJSONPCallback() {
  (window as any).CoralCount = {
    setCount: (data: { ref: string; html: string }) => {
      // Find all the elements with ref.
      const elements = document.querySelectorAll(
        `${COUNT_SELECTOR}[data-coral-ref='${data.ref}']`
      );
      Array.prototype.forEach.call(elements, (element: HTMLElement) => {
        element.innerHTML = data.html;
      });
    },
  };
}

export default injectJSONPCallback;
