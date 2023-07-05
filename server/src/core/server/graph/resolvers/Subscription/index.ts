import { GQLSubscriptionTypeResolver } from "coral-server/graph/schema/__generated__/types";

import { commentCreated } from "./commentCreated";
import { commentEdited } from "./commentEdited";
import { commentEntered } from "./commentEntered";
import { commentEnteredModerationQueue } from "./commentEnteredModerationQueue";
import { commentFeatured } from "./commentFeatured";
import { commentLeftModerationQueue } from "./commentLeftModerationQueue";
import { commentReleased } from "./commentReleased";
import { commentReplyCreated } from "./commentReplyCreated";
import { commentStatusUpdated } from "./commentStatusUpdated";

export const Subscription: Required<GQLSubscriptionTypeResolver> = {
  commentCreated,
  commentEntered,
  commentEnteredModerationQueue,
  commentLeftModerationQueue,
  commentReplyCreated,
  commentStatusUpdated,
  commentFeatured,
  commentReleased,
  commentEdited,
};

export { CommentFeaturedInput } from "./commentFeatured";
export { CommentCreatedInput } from "./commentCreated";
export { CommentEnteredModerationQueueInput } from "./commentEnteredModerationQueue";
export { CommentLeftModerationQueueInput } from "./commentLeftModerationQueue";
export { CommentReleasedInput } from "./commentReleased";
export { CommentReplyCreatedInput } from "./commentReplyCreated";
export { CommentStatusUpdatedInput } from "./commentStatusUpdated";
export { CommentEnteredInput } from "./commentEntered";
export { CommentEditedInput } from "./commentEdited";
