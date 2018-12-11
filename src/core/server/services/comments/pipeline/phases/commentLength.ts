import striptags from "striptags";

import { isNil } from "lodash";
import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { ACTION_TYPE } from "talk-server/models/action/comment";
import { ModerationSettings } from "talk-server/models/settings";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/pipeline";

const testCharCount = (
  settings: Partial<ModerationSettings>,
  length: number
) => {
  // settings.charCount.enable && settings.charCount && length > settings.charCount;

  if (settings.charCount && settings.charCount.enabled) {
    if (!isNil(settings.charCount.min)) {
      if (length < settings.charCount.min) {
        return true;
      }
    }
    if (!isNil(settings.charCount.max)) {
      if (length > settings.charCount.max) {
        return true;
      }
    }
  }

  return false;
};

export const commentLength: IntermediateModerationPhase = ({
  story,
  tenant,
  comment,
}): IntermediatePhaseResult | void => {
  const length = striptags(comment.body).length;

  // Reject if the comment is too long or too short.
  if (
    testCharCount(tenant, length) ||
    (story.settings && testCharCount(story.settings, length))
  ) {
    return {
      status: GQLCOMMENT_STATUS.REJECTED,
      actions: [
        {
          userID: null,
          actionType: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BODY_COUNT,
          metadata: {
            count: length,
          },
        },
      ],
    };
  }
};
