import {
  GQLACTION_GROUP,
  GQLACTION_TYPE,
  GQLCOMMENT_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { ModerationSettings } from "talk-server/models/settings";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/moderation";

const testCharCount = (settings: Partial<ModerationSettings>, length: number) =>
  settings.charCountEnable && settings.charCount && length > settings.charCount;

export const commentLength: IntermediateModerationPhase = ({
  asset,
  tenant,
  comment,
}): IntermediatePhaseResult | void => {
  const length = comment.body ? comment.body.length : 0;

  // Check to see if the body is too short, if it is, then complain about it!
  if (length < 2) {
    // TODO: (wyattjoh) return better error.
    throw new Error("comment body too short");
  }

  // Reject if the comment is too long
  if (
    testCharCount(tenant, length) ||
    (asset.settings && testCharCount(asset.settings, length))
  ) {
    // Add the flag related to Trust to the comment.
    return {
      status: GQLCOMMENT_STATUS.REJECTED,
      actions: [
        {
          action_type: GQLACTION_TYPE.FLAG,
          group_id: GQLACTION_GROUP.BODY_COUNT,
          metadata: {
            count: length,
          },
        },
      ],
    };
  }
};
