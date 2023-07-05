import { COUNT_SELECTOR } from "coral-framework/constants";
import detectCountScript from "coral-framework/helpers/detectCountScript";
import getCurrentScriptOrigin from "coral-framework/helpers/getCurrentScriptOrigin";
import resolveStoryURL from "coral-framework/helpers/resolveStoryURL";
import jsonp from "coral-framework/utils/jsonp";

import injectJSONPCallback from "./injectJSONPCallback";

/** Arguments that will be send to the server. */
interface CountQueryArgs {
  id?: string;
  url?: string;
  notext: boolean;
}

/** createCountQueryRef creates a unique reference from the query args */
function createCountQueryRef(args: CountQueryArgs) {
  return btoa(`${args.notext ? "true" : "false"};${args.id || args.url}`);
}

interface DetectAndInjectArgs {
  reset?: boolean;
}

/** Detects count elements and use jsonp to inject the counts. */
function detectAndInject(opts: DetectAndInjectArgs = {}) {
  const ORIGIN = getCurrentScriptOrigin();
  const STORY_URL = resolveStoryURL(window);

  /** A map of references pointing to the count query arguments */
  const queryMap: Record<string, CountQueryArgs> = {};

  // Find all the selected elements and fill the queryMap.
  const elements = document.querySelectorAll(COUNT_SELECTOR);
  Array.prototype.forEach.call(elements, (element: HTMLElement) => {
    const id = element.dataset.coralId;
    const notext = element.dataset.coralNotext === "true";

    // If there is no URL or ID on the element, add one based on the story url
    // that we detected.
    let url = element.dataset.coralUrl;
    if (!url && !id) {
      url = STORY_URL;
      element.dataset.coralUrl = STORY_URL;
    }

    // Construct the args for generating the ref.
    const args = { id, url, notext };

    // Get or create a ref.
    let ref = element.dataset.coralRef;
    if (!ref) {
      ref = createCountQueryRef(args);
      element.dataset.coralRef = ref;
    } else {
      // The element already had a ref attached to it, which means it's already
      // been processed. If we aren't resetting, we should skip this.
      if (!opts.reset) {
        return;
      }
    }

    // Add it to the managed set if we haven't already.
    if (!(ref in queryMap)) {
      queryMap[ref] = args;
    }
  });

  // Call server using JSONP.
  Object.keys(queryMap).forEach((ref) => {
    const { url, id, notext } = queryMap[ref];

    // Compile the arguments used to generate the
    const args: Record<string, string | undefined> = {
      id,
      url,
      notext: notext ? "true" : "false",
      ref,
    };

    // Special handling for when the count is reset.
    if (opts.reset) {
      // Add the date as an argument to cache bust.
      args.d = Date.now().toString();
    }

    // Add the script element with the specified options to the page.
    jsonp(`${ORIGIN}/api/story/count.js`, "CoralCount.setCount", args);
  });
}

export function main() {
  // Inject the JSONP callback with the detection script to be used as the
  // CoralCount.getCount callback.
  injectJSONPCallback(detectAndInject);
  detectAndInject();
}

if (!detectCountScript(window) && process.env.NODE_ENV !== "test") {
  main();
}
