import { GQLRejectCommentPayloadResolvers } from "coral-server/graph/schema/__generated__/types";

import { moderationQueuesResolver } from "./ModerationQueues";

export const RejectCommentPayload: GQLRejectCommentPayloadResolvers = {
  moderationQueues: moderationQueuesResolver,
};
