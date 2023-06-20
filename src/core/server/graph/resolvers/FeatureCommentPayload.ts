import { GQLFeatureCommentPayloadResolvers } from "coral-server/graph/schema/__generated__/types";

import { moderationQueuesResolver } from "./ModerationQueues";

export const FeatureCommentPayload: GQLFeatureCommentPayloadResolvers = {
  moderationQueues: moderationQueuesResolver,
};
