import { JSDOM } from "jsdom";

import { createPurify, sanitizeCommentBody } from "talk-common/utils/purify";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/pipeline";

// Initializing JSDOM and DOMPurify
const window = new JSDOM("", {}).window;
const DOMPurify = createPurify(window);

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
