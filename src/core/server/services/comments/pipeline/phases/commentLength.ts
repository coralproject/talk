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
  if (tenant.settings.charCount && tenant.settings.charCount.enabled) {
    if (!isNil(tenant.settings.charCount.min)) {
      if (length < tenant.settings.charCount.min) {
        throw new CommentBodyTooShortError(tenant.settings.charCount.min);
      }
    }
    if (!isNil(tenant.settings.charCount.max)) {
      if (length > tenant.settings.charCount.max) {
        throw new CommentBodyExceedsMaxLengthError(
          tenant.settings.charCount.max
        );
      }
    }
  }
};
