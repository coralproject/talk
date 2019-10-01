import { COUNT_SELECTOR } from "coral-framework/constants";
import detectCountScript from "coral-framework/helpers/detectCountScript";

/**
 * injectCountScriptIfNeeded will detect if comment count injection is necessary and
 * automatically includes the `count.js` script.
 */
const injectCountScriptIfNeeded = (rootURL: string) => {
  if (detectCountScript()) {
    return;
  }
  // Detect if we need to inject counts.
  if (document.querySelector(COUNT_SELECTOR)) {
    const s = document.createElement("script");
    s.src = `${rootURL}/assets/js/count.js`;
    s.async = false;
    s.defer = true;
    (document.head || document.body).appendChild(s);
  }
};

export default injectCountScriptIfNeeded;
