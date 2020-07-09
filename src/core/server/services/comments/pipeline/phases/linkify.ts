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
}): Promise<IntermediatePhaseResult | void> => ({
  body: bodyText.trim().length > 0 ? linkifyjs(comment.body, config) : "",
});
