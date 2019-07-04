import striptags from "striptags";

import {
  CommentBodyExceedsMaxLengthError,
  CommentBodyTooShortError,
} from "coral-server/errors";
import { Settings } from "coral-server/models/settings";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";
import { isNil } from "lodash";

const testCharCount = (settings: Partial<Settings>, length: number) => {
  if (settings.charCount && settings.charCount.enabled) {
    if (!isNil(settings.charCount.min)) {
      if (length < settings.charCount.min) {
        throw new CommentBodyTooShortError(settings.charCount.min);
      }
    }
    if (!isNil(settings.charCount.max)) {
      if (length > settings.charCount.max) {
        throw new CommentBodyExceedsMaxLengthError(settings.charCount.max);
      }
    }
  }
};

export const commentLength: IntermediateModerationPhase = ({
  story,
  tenant,
  comment,
}): IntermediatePhaseResult | void => {
  const length = striptags(comment.body).length;

  // Reject if the comment is too long or too short.
  testCharCount(tenant, length);
};
