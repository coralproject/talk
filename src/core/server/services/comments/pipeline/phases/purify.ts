import { JSDOM } from "jsdom";

import createSanitize from "coral-common/helpers/createSanitize";
import removeTrailingEmptyLines from "coral-common/helpers/removeTrailingEmptyLines";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

// Initializing JSDOM and DOMPurify
const window = new JSDOM("", {}).window;
const sanitize = createSanitize(window as any);

function sanitizeCommentBody(source: string) {
  // Sanitize and return the HTMLBodyElement for the parsed source.
  const sanitized = sanitize(source);

  // Count the total number of anchor links in the sanitized output, this is the
  // number of links.
  const linkCount = sanitized.getElementsByTagName("a").length;

  // Remove empty trailing lines.
  removeTrailingEmptyLines(sanitized);

  return {
    body: sanitized.innerHTML,
    linkCount,
  };
}

export const purify: IntermediateModerationPhase = async ({
  comment,
}): Promise<IntermediatePhaseResult | void> => {
  const { body, linkCount } = sanitizeCommentBody(comment.body);

  return {
    body,
    metadata: {
      linkCount,
    },
  };
};
