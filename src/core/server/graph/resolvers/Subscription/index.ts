import { GQLSubscriptionTypeResolver } from "coral-server/graph/schema/__generated__/types";

import { commentCreated } from "./commentCreated";
import { commentEnteredModerationQueue } from "./commentEnteredModerationQueue";
import { commentFeatured } from "./commentFeatured";
import { commentLeftModerationQueue } from "./commentLeftModerationQueue";
import { commentReleased } from "./commentReleased";
import { commentReplyCreated } from "./commentReplyCreated";
import { commentStatusUpdated } from "./commentStatusUpdated";
import { liveStoryViewersUpdate } from "./liveStoryViewersUpdate";

export const Subscription: Required<GQLSubscriptionTypeResolver> = {
  commentCreated,
  commentEnteredModerationQueue,
  commentLeftModerationQueue,
  commentReplyCreated,
  commentStatusUpdated,
  commentFeatured,
  commentReleased,
  liveStoryViewersUpdate,
};

export { CommentFeaturedInput } from "./commentFeatured";
export { CommentCreatedInput } from "./commentCreated";
export { CommentEnteredModerationQueueInput } from "./commentEnteredModerationQueue";
export { CommentLeftModerationQueueInput } from "./commentLeftModerationQueue";
export { CommentReleasedInput } from "./commentReleased";
export { CommentReplyCreatedInput } from "./commentReplyCreated";
export { CommentStatusUpdatedInput } from "./commentStatusUpdated";
export { LiveStoryViewersUpdateInput } from "./liveStoryViewersUpdate";
