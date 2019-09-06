import { GQLSubscriptionTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";

import { commentCreated } from "./commentCreated";
import { commentEnteredModerationQueue } from "./commentEnteredModerationQueue";
import { commentFeatured } from "./commentFeatured";
import { commentLeftModerationQueue } from "./commentLeftModerationQueue";
import { commentReplyCreated } from "./commentReplyCreated";
import { commentStatusUpdated } from "./commentStatusUpdated";

export const Subscription: GQLSubscriptionTypeResolver = {
  commentCreated,
  commentEnteredModerationQueue,
  commentLeftModerationQueue,
  commentReplyCreated,
  commentStatusUpdated,
  commentFeatured,
};
