import { detectCommentEmbedScript } from "coral-framework/helpers";
import getCurrentScriptOrigin from "coral-framework/helpers/getCurrentScriptOrigin";
import jsonp from "coral-framework/utils/jsonp";

import injectJSONPCallback from "./injectJSONPCallback";

/** Arguments that will be sent to the server. */
interface CommentEmbedQueryArgs {
  commentID?: string;
  interactions?: string;
}

/** createCommentEmbedQueryRef creates a unique reference from the query args */
function createCommentEmbedQueryRef(args: CommentEmbedQueryArgs) {
  return btoa(`${args.commentID}`);
}

interface DetectAndInjectArgs {
  reset?: boolean;
}

/** Detects comment embed elements and use jsonp to inject the comment embed. */
function detectAndInject(opts: DetectAndInjectArgs = {}) {
  const ORIGIN = getCurrentScriptOrigin();

  /** A map of references pointing to the comment embed query arguments */
  const queryMap: Record<string, CommentEmbedQueryArgs> = {};

  // Find all the selected elements and fill the queryMap.
  const elements = document.querySelectorAll(".coral-comment-embed");
  Array.prototype.forEach.call(elements, (element: HTMLElement) => {
    const commentID = element.dataset.commentid;
    const interactions = element.dataset.interactions;

    // Construct the args for generating the ref.
    const args = { commentID, interactions };

    // Get or create a ref.
    let ref = element.dataset.coralRef;
    if (!ref) {
      ref = createCommentEmbedQueryRef(args);
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
    const { commentID, interactions } = queryMap[ref];

    // Compile the arguments used to generate the
    const args: Record<string, string | undefined> = {
      interactions,
      commentID,
      ref,
    };

    // Add the script element with the specified options to the page.
    jsonp(
      `${ORIGIN}/api/comment/commentEmbed.js`,
      "CoralCommentEmbed.setCommentEmbed",
      args
    );
  });
}

export function main() {
  // Inject the JSONP callback with the detection script to be used as the
  // CoralCommentEmbed.getCommentEmbed callback.
  injectJSONPCallback(detectAndInject);
  detectAndInject();
}

if (!detectCommentEmbedScript(window) && process.env.NODE_ENV !== "test") {
  main();
}
