import {
  COMMENT_EMBED_SELECTOR,
  ORIGIN_FALLBACK_ID,
} from "coral-framework/constants";
import { detectCommentEmbedScript } from "coral-framework/helpers";

/**
 * injectCommentEmbedScriptIfNeeded will detect if comment embed injection is necessary and
 * automatically includes the `commentEmbed.js` script.
 */
const injectCommentEmbedScriptIfNeeded = (
  rootURL: string,
  timestamp: number
) => {
  if (detectCommentEmbedScript(window)) {
    return;
  }
  if (document.querySelector(COMMENT_EMBED_SELECTOR)) {
    const s = document.createElement("script");
    s.src = `${rootURL}/assets/js/commentEmbed.js?ts=${timestamp}`;
    s.className = ORIGIN_FALLBACK_ID;
    s.async = false;
    s.defer = true;
    (document.head || document.body).appendChild(s);
  }
};

export default injectCommentEmbedScriptIfNeeded;
