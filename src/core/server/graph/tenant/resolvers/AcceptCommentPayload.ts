import { GQLAcceptCommentPayloadTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";

import { moderationQueuesResolver } from "./ModerationQueues";

export const AcceptCommentPayload: GQLAcceptCommentPayloadTypeResolver = {
  moderationQueues: moderationQueuesResolver,
};
