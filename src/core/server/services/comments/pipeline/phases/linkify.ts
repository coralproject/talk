import linkifyjs, { Options } from "linkifyjs/html";

import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

// linkify configuration.
const config: Options = {
  className: "",
  tagName: "a",
  // If the href starts with `//`, then it shouldn't be treated as a valid URL
  // because this is not commonly used in posted URL's.
  validate: (href: string) => !href.startsWith("//"),
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
