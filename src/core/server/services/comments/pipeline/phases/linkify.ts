import linkifyjs from "linkifyjs/html";

import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

// linkify configuration.
const config = {
  className: "",
  tagName: "a",
};

export const linkify: IntermediateModerationPhase = async ({
  comment,
  bodyText,
}): Promise<IntermediatePhaseResult | void> => {
  if (bodyText.trim().length > 0) {
    return {
      body: linkifyjs(comment.body, config),
    };
  }
};
