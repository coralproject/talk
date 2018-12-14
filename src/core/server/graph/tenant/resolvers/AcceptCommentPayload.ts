import { GQLAcceptCommentPayloadTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";

import { moderationQueuesPayloadResolver } from "./ModerationQueues";

export const AcceptCommentPayload: GQLAcceptCommentPayloadTypeResolver = {
  moderationQueues: moderationQueuesPayloadResolver,
};
