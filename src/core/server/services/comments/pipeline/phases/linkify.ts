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
}): Promise<IntermediatePhaseResult | void> => ({
  body: linkifyjs(comment.body, config),
});
