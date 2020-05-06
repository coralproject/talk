import { DOMPurifyI } from "dompurify";
import { JSDOM } from "jsdom";

import createPurify from "coral-common/helpers/createPurify";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

// Initializing JSDOM and DOMPurify
const window = new JSDOM("", {}).window;
const DOMPurify = createPurify(window as any);

function sanitizeCommentBody(purify: DOMPurifyI, source: string) {
  // Sanitize and return the HTMLBodyElement for the parsed source.
  const sanitized = purify.sanitize(
    source,
    // TODO: Be aware, this has only affect on the return type. It does not affect the config.
    { RETURN_DOM: true }
  );

  // Count the total number of anchor links in the sanitized output, this is the
  // number of links.
  const linkCount = sanitized.getElementsByTagName("a").length;

  return {
    body: sanitized.innerHTML,
    linkCount,
  };
}

export const purify: IntermediateModerationPhase = async ({
  comment,
}): Promise<IntermediatePhaseResult | void> => {
  const { body, linkCount } = sanitizeCommentBody(DOMPurify, comment.body);

  return {
    body,
    metadata: {
      linkCount,
    },
  };
};
