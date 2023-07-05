import { GQLRejectCommentPayloadTypeResolver } from "coral-server/graph/schema/__generated__/types";

import { moderationQueuesResolver } from "./ModerationQueues";

export const RejectCommentPayload: GQLRejectCommentPayloadTypeResolver = {
  moderationQueues: moderationQueuesResolver,
};
