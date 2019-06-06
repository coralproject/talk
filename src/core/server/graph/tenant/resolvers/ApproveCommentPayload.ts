import { GQLApproveCommentPayloadTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";

import { moderationQueuesResolver } from "./ModerationQueues";

export const ApproveCommentPayload: GQLApproveCommentPayloadTypeResolver = {
  moderationQueues: moderationQueuesResolver,
};
