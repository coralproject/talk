import { GQLRejectCommentPayloadTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";

import { moderationQueuesPayloadResolver } from "./ModerationQueues";

export const RejectCommentPayload: GQLRejectCommentPayloadTypeResolver = {
  moderationQueues: moderationQueuesPayloadResolver,
};
