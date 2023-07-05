import {
  COMMENT_EMBED_SELECTOR,
  ORIGIN_FALLBACK_ID,
} from "coral-framework/constants";
import { detectCommentEmbedScript } from "coral-framework/helpers";

import { StreamEmbedConfig } from "./StreamEmbed";

/**
 * injectCommentEmbedScriptIfNeeded will detect if comment embed injection is necessary and
 * automatically includes the `commentEmbed.js` script.
 */
const injectCommentEmbedScriptIfNeeded = (
  config: StreamEmbedConfig,
  timestamp: number
) => {
  if (detectCommentEmbedScript(window)) {
    return;
  }
  if (document.querySelector(COMMENT_EMBED_SELECTOR)) {
    const s = document.createElement("script");
    s.src = `${config.rootURL}/assets/js/commentEmbed.js?ts=${timestamp}`;
    s.className = ORIGIN_FALLBACK_ID;
    s.setAttribute("id", "coralSingleCommentEmbedScript");
    if (config.customCSSURL) {
      s.setAttribute("data-customCSSURL", config.customCSSURL);
    }
    if (config.customFontsCSSURL) {
      s.setAttribute("data-customFontsCSSURL", config.customFontsCSSURL);
    }
    s.async = false;
    s.defer = true;
    (document.head || document.body).appendChild(s);
  }
};

export default injectCommentEmbedScriptIfNeeded;
