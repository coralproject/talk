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
  htmlStripped,
}): IntermediatePhaseResult | void => {
  const length = htmlStripped.trim().length;
  if (tenant.ownSettings.charCount && tenant.ownSettings.charCount.enabled) {
    if (!isNil(tenant.ownSettings.charCount.min)) {
      if (length < tenant.ownSettings.charCount.min) {
        throw new CommentBodyTooShortError(tenant.ownSettings.charCount.min);
      }
    }
    if (!isNil(tenant.ownSettings.charCount.max)) {
      if (length > tenant.ownSettings.charCount.max) {
        throw new CommentBodyExceedsMaxLengthError(
          tenant.ownSettings.charCount.max
        );
      }
    }
  }
};
