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
  if (tenant.charCount && tenant.charCount.enabled) {
    if (!isNil(tenant.charCount.min)) {
      if (length < tenant.charCount.min) {
        throw new CommentBodyTooShortError(tenant.charCount.min);
      }
    }
    if (!isNil(tenant.charCount.max)) {
      if (length > tenant.charCount.max) {
        throw new CommentBodyExceedsMaxLengthError(tenant.charCount.max);
      }
    }
  }
};
