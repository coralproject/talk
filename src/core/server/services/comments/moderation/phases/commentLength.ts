import striptags from "striptags";

import { isNil } from "lodash";
import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { ACTION_TYPE } from "talk-server/models/action";
import { ModerationSettings } from "talk-server/models/settings";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/moderation";

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
  asset,
  tenant,
  comment,
}): IntermediatePhaseResult | void => {
  const length = comment.body ? striptags(comment.body).length : 0;

  // Reject if the comment is too long or too short.
  if (
    testCharCount(tenant, length) ||
    (asset.settings && testCharCount(asset.settings, length))
  ) {
    return {
      status: GQLCOMMENT_STATUS.REJECTED,
      actions: [
        {
          action_type: ACTION_TYPE.FLAG,
          reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_BODY_COUNT,
          metadata: {
            count: length,
          },
        },
      ],
    };
  }
};
