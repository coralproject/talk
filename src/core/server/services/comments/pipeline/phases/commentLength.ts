import { isNil } from "lodash";

import {
  CommentBodyExceedsMaxLengthError,
  CommentBodyTooShortError,
} from "coral-server/errors";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import { GQLCharCount } from "coral-server/graph/schema/__generated__/types";

function resolveBound(
  charCount: GQLCharCount,
  key: keyof Omit<GQLCharCount, "enabled">,
  defaultBound = 0
) {
  const bound = charCount[key];
  if (charCount.enabled && !isNil(bound)) {
    return bound;
  }

  return defaultBound;
}

export const commentLength: IntermediateModerationPhase = ({
  tenant,
  bodyText,
  media,
  comment,
}): IntermediatePhaseResult | void => {
  const max = resolveBound(tenant.charCount, "max");
  if (max && bodyText.length > max) {
    throw new CommentBodyExceedsMaxLengthError(max);
  }

  if (
    // Check if a Giphy attachment is attached...
    media?.type === "giphy" ||
    // Or a external image is attached...
    media?.type === "external" ||
    // Or a rating is attached...
    comment.rating
  ) {
    // Then we don't need to check for a minimum!
    return;
  }

  const min = resolveBound(tenant.charCount, "min", 1);
  if (bodyText.length < min) {
    throw new CommentBodyTooShortError(min);
  }
};
