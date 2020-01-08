import { GQLSubscriptionTypeResolver } from "coral-server/graph/schema/__generated__/types";

import { commentCreated } from "./commentCreated";
import { commentEnteredModerationQueue } from "./commentEnteredModerationQueue";
import { commentFeatured } from "./commentFeatured";
import { commentLeftModerationQueue } from "./commentLeftModerationQueue";
import { commentReleased } from "./commentReleased";
import { commentReplyCreated } from "./commentReplyCreated";
import { commentStatusUpdated } from "./commentStatusUpdated";

export const Subscription: GQLSubscriptionTypeResolver = {
  commentCreated,
  commentEnteredModerationQueue,
  commentLeftModerationQueue,
  commentReplyCreated,
  commentStatusUpdated,
  commentFeatured,
  commentReleased,
};
