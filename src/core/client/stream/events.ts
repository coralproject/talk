import {
  createViewerEvent,
  createViewerLoadMoreEvent,
  createViewerNetworkEvent,
} from "coral-framework/lib/events";

import { COMMENT_STATUS } from "./__generated__/CreateCommentMutation.graphql";

/**
 * CreateCommentEvent is fired whenever a top level comment is created.
 */
export const CreateCommentEvent = createViewerNetworkEvent<{
  storyID: string;
  body: string;
  success: {
    id: string;
    status: COMMENT_STATUS;
  };
  error: {
    message: string;
    code?: string;
  };
}>("createComment");

/**
 * CreateCommentReactionEvent is fired whenever the viewer reacts to a comment.
 */
export const CreateCommentReactionEvent = createViewerNetworkEvent<{
  commentID: string;
  commentRevisionID: string;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("createCommentReaction");

/**
 * RemoveCommentReactionEvent is fired whenever the viewer deletes its reaction from a comment.
 */
export const RemoveCommentReactionEvent = createViewerNetworkEvent<{
  commentID: string;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("removeCommentReaction");

/**
 * SignOutEvent is fired when the viewer signs out.
 */
export const SignOutEvent = createViewerNetworkEvent<{
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("signOut");

/**
 * FeaturedCommentsLoadMoreEvent is fired when the viewer loads more
 * fetured comments.
 */
export const FeaturedCommentsLoadMoreEvent = createViewerLoadMoreEvent(
  "loadMoreFeaturedComments"
);

/**
 * LoginPromptEvent is fired whenever the viewer does an
 * action that will prompt a login dialog.
 */
export const LoginPromptEvent = createViewerEvent("loginPrompt");

/**
 * ShowAuthPopupEvent is fired whenever the viewer requests the auth popup.
 */
export const ShowAuthPopupEvent = createViewerEvent<{
  view: string;
}>("showAuthPopup");

/**
 * SetMainTabEvent is fired whenever the viewer changes the
 * tab of the main tab bar.
 */
export const SetMainTabEvent = createViewerEvent<{
  tab: string;
}>("setMainTab");

/**
 * SetProfileTabEvent is fired whenever the viewer changes the
 * tab of the profile tab bar.
 */
export const SetProfileTabEvent = createViewerEvent<{
  tab: string;
}>("setProfileTab");

/**
 * SetCommentsTabEvent is fired whenever the viewer changes the
 * tab of the comments tab bar.
 */
export const SetCommentsTabEvent = createViewerEvent<{
  tab: string;
}>("setCommentsTab");

/**
 * SetCommentsOrderByEvent is fired whenever the viewer changes the
 * sort order of the comments.
 */
export const SetCommentsOrderByEvent = createViewerEvent<{
  orderBy: string;
}>("setCommentsOrderBy");

/**
 * ViewConversationEvent is fired whenever the viewer changes to
 * a single conversation view.
 */
export const ViewConversationEvent = createViewerEvent<{
  from: "FEATURED_COMMENTS" | "ALL_COMMENTS" | "MY_PROFILE";
  commentID: string;
}>("viewConversation");

/**
 * ShowUserPopover is fired whenever the viewer clicks
 * on a username which shows the user popover.
 */
export const ShowUserPopoverEvent = createViewerEvent<{
  userID: string;
}>("showUserPopover");

/**
 * ShowAbsoluteTimestamp is fired whenever the viewer clicks
 * on the relative timestamp to show the absolute time.
 */
export const ShowAbsoluteTimestampEvent = createViewerEvent(
  "showAbsoluteTimestamp"
);

/**
 * ShowFeaturedCommentTooltip is fired when the viewer clicks to show the
 * featured comment tooltip.
 */
export const ShowFeaturedCommentTooltipEvent = createViewerEvent(
  "showFeaturedCommentTooltip"
);
