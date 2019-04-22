import {
  GQLCOMMENT_STATUS,
  GQLUSER_ROLE,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { COMMENT_TAG_TYPE } from "talk-server/models/comment/tag";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/pipeline";

// If a given user is a staff member, always approve their comment.
export const staff: IntermediateModerationPhase = ({
  author,
  now,
}): IntermediatePhaseResult | void => {
  if (author.role !== GQLUSER_ROLE.COMMENTER) {
    return {
      status: GQLCOMMENT_STATUS.ACCEPTED,
      tags: [
        {
          type: COMMENT_TAG_TYPE.STAFF,
          createdAt: now,
        },
      ],
    };
  }
};
