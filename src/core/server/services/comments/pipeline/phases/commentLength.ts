import striptags from "striptags";

import { isNil } from "lodash";
import {
  CommentBodyExceedsMaxLengthError,
  CommentBodyTooShortError,
} from "talk-server/errors";
import { Settings } from "talk-server/models/settings";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/pipeline";

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
  if (story.settings) {
    testCharCount(story.settings, length);
  }
};
