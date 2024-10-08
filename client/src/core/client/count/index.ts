import { COUNT_SELECTOR } from "coral-framework/constants";
import {
  bytesToBase64,
  detectCountScript,
  resolveStoryURL,
} from "coral-framework/helpers";
import jsonp from "coral-framework/utils/jsonp";

import injectJSONPCallback from "./injectJSONPCallback";

/** Arguments that will be send to the server. */
interface CountQueryArgs {
  id?: string;
  url?: string;
}

/** createCountQueryRef creates a unique reference from the query args */
function createCountQueryRef(args: CountQueryArgs) {
  return bytesToBase64(new TextEncoder().encode(`${args.url}`));
}

interface DetectAndInjectArgs {
  reset?: boolean;
}

/** Detects count elements and use jsonp to inject the counts. */
function detectAndInject(opts: DetectAndInjectArgs = {}) {
  // Get ORIGIN from the count.js script that we know will be on the page.
  const ORIGIN = document
    .querySelector(".coral-script")
    ?.getAttribute("src")
    ?.split("/assets")[0];
  const STORY_URL = resolveStoryURL(window);

  /** A map of references pointing to the count query arguments */
  const queryMap: Record<string, CountQueryArgs> = {};

  // Find all the selected elements and fill the queryMap.
  const elements = document.querySelectorAll(COUNT_SELECTOR);
  Array.prototype.forEach.call(elements, (element: HTMLElement) => {
    const id = element.dataset.coralId;

    // If there is no URL or ID on the element, add one based on the story url
    // that we detected.
    let url = element.dataset.coralUrl;
    if (!url) {
      url = STORY_URL;
      element.dataset.coralUrl = STORY_URL;
    }

    // Construct the args for generating the ref.
    const args = { id, url };

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
    const { url, id } = queryMap[ref];

    // Compile the arguments used to generate the
    const args: Record<string, string | undefined> = {
      id,
      url,
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
