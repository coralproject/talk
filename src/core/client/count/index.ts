import { COUNT_SELECTOR, ORIGIN_FALLBACK_ID } from "coral-framework/constants";
import detectCountScript from "coral-framework/helpers/detectCountScript";
import resolveStoryURL from "coral-framework/helpers/resolveStoryURL";
import jsonp from "coral-framework/utils/jsonp";

import getCurrentScriptOrigin from "./getCurrentScriptOrigin";
import injectJSONPCallback from "./injectJSONPCallback";

/** Arguments that will be send to the server. */
interface CountQueryArgs {
  id?: string;
  url?: string;
  notext?: boolean;
}

/** createCountQueryRef creates a unique reference from the query args */
function createCountQueryRef(args: CountQueryArgs) {
  return btoa(`${JSON.stringify(!!args.notext)};${args.id || args.url}`);
}

/** Detects count elements and use jsonp to inject the counts. */
function detectAndInject() {
  const ORIGIN = getCurrentScriptOrigin(ORIGIN_FALLBACK_ID);
  const STORY_URL = resolveStoryURL();
  /** A map of references pointing to the count query arguments */
  const queryMap: Record<string, CountQueryArgs> = {};

  // Find all the selected elements and fill the queryMap.
  const elements = document.querySelectorAll(COUNT_SELECTOR);
  Array.prototype.forEach.call(elements, (element: HTMLElement) => {
    let url = element.dataset.coralUrl;
    const id = element.dataset.coralId;
    const notext = element.dataset.coralNotext === "true";
    if (!url && !id) {
      url = STORY_URL;
      element.dataset.coralUrl = STORY_URL;
    }
    const args = { id, url, notext };
    const ref = createCountQueryRef(args);
    if (!(ref in queryMap)) {
      queryMap[ref] = args;
    }
    element.dataset.coralRef = ref;
  });

  // Call server using JSONP.
  Object.keys(queryMap).forEach(ref => {
    const { url, id, notext } = queryMap[ref];
    const args = { url, id, notext: notext ? "true" : "false", ref };
    jsonp(`${ORIGIN}/api/story/count.js`, "CoralCount.setCount", args);
  });
}

export function main() {
  injectJSONPCallback();
  detectAndInject();
}

if (!detectCountScript() && process.env.NODE_ENV !== "test") {
  main();
}
