import { isNil } from "lodash";

import {
  CommentBodyExceedsMaxLengthError,
  CommentBodyTooShortError,
} from "coral-server/errors";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

export const commentLength: IntermediateModerationPhase = ({
  tenant,
  bodyText,
  comment,
  embeds,
}): IntermediatePhaseResult | void => {
  const length = bodyText.length;
  let min: number | null = null;
  let max: number | null = null;
  if (tenant.charCount && tenant.charCount.enabled) {
    if (!isNil(tenant.charCount.min)) {
      min = tenant.charCount.min;
    }
    if (!isNil(tenant.charCount.max)) {
      max = tenant.charCount.max;
    }
  }
  if (!min) {
    // Comment body should have at least 1 character.
    min = 1;
  }

  const embed = embeds && embeds.length > 0 ? embeds[0] : null;

  if (!(embed && embed.source === "GIPHY" && tenant.embeds.giphy)) {
    if (length < min) {
      throw new CommentBodyTooShortError(min);
    }
    if (max && length > max) {
      throw new CommentBodyExceedsMaxLengthError(max);
    }
  }
};
