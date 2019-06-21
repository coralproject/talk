import { GQLSubscriptionTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";

import { commentEnteredModerationQueue } from "./commentEnteredModerationQueue";
import { commentLeftModerationQueue } from "./commentLeftModerationQueue";
import { commentStatusUpdated } from "./commentStatusUpdated";

export const Subscription: GQLSubscriptionTypeResolver = {
  commentEnteredModerationQueue,
  commentLeftModerationQueue,
  commentStatusUpdated,
};
