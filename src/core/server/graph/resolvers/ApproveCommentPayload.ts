import { GQLApproveCommentPayloadResolvers } from "coral-server/graph/schema/__generated__/types";

import { moderationQueuesResolver } from "./ModerationQueues";

export const ApproveCommentPayload: GQLApproveCommentPayloadResolvers = {
  moderationQueues: moderationQueuesResolver,
};
