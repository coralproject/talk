import {
  createViewerEvent,
  createViewerNetworkEvent,
} from "coral-framework/lib/events";

import { COMMENT_STATUS } from "./__generated__/CreateCommentMutation.graphql";

/**
 * CreateCommentEvent is emitted when a top level comment is created.
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
 * CreateCommentReplyEvent is emitted when a comment reply is created.
 */
export const CreateCommentReplyEvent = createViewerNetworkEvent<{
  body: string;
  parentID: string;
  success: {
    id: string;
    status: COMMENT_STATUS;
  };
  error: {
    message: string;
    code?: string;
  };
}>("createCommentReply");

/**
 * EditCommentEvent is emitted when a comment is edited.
 */
export const EditCommentEvent = createViewerNetworkEvent<{
  body: string;
  commentID: string;
  success: {
    status: COMMENT_STATUS;
  };
  error: {
    message: string;
    code?: string;
  };
}>("editComment");

/**
 * CreateCommentReactionEvent is emitted when the viewer reacts to a comment.
 */
export const CreateCommentReactionEvent = createViewerNetworkEvent<{
  commentID: string;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("createCommentReaction");

/**
 * RemoveCommentReactionEvent is emitted when the viewer deletes its reaction from a comment.
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
 * IgnoreUserEvent is emitted when the viewer ignores a user.
 */
export const IgnoreUserEvent = createViewerNetworkEvent<{
  userID: string;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("ignoreUser");

/**
 * RemoveUserIgnoreEvent is emitted when the viewer remove a user from
 * its ignored users list.
 */
export const RemoveUserIgnoreEvent = createViewerNetworkEvent<{
  userID: string;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("removeUserIgnore");

/**
 * SignOutEvent is emitted when the viewer signs out.
 */
export const SignOutEvent = createViewerNetworkEvent<{
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("signOut");

/**
 * LoadMoreFeaturedCommentsEvent is emitted when the viewer loads more
 * featured comments.
 */
export const LoadMoreFeaturedCommentsEvent = createViewerNetworkEvent<{
  storyID: string;
  success: {};
  error: { message: string; code?: string };
}>("loadMoreFeaturedComments");

/**
 * LoadMoreAllCommentsEvent is emitted when the viewer loads more
 * top level comments into the comment stream.
 */
export const LoadMoreAllCommentsEvent = createViewerNetworkEvent<{
  storyID: string;
  success: {};
  error: { message: string; code?: string };
}>("loadMoreAllComments");

/**
 * ShowAllRepliesEvent is emitted when the viewer reveals
 * all replies of a comment.
 */
export const ShowAllRepliesEvent = createViewerNetworkEvent<{
  commentID: string;
  success: {};
  error: { message: string; code?: string };
}>("showAllReplies");

/**
 * LoginPromptEvent is emitted when the viewer does an
 * action that will prompt a login dialog.
 */
export const LoginPromptEvent = createViewerEvent("loginPrompt");

/**
 * ShowAuthPopupEvent is emitted when the viewer requests the auth popup.
 */
export const ShowAuthPopupEvent = createViewerEvent<{
  view: string;
}>("showAuthPopup");

/**
 * SetMainTabEvent is emitted when the viewer changes the
 * tab of the main tab bar.
 */
export const SetMainTabEvent = createViewerEvent<{
  tab: string;
}>("setMainTab");

/**
 * SetProfileTabEvent is emitted when the viewer changes the
 * tab of the profile tab bar.
 */
export const SetProfileTabEvent = createViewerEvent<{
  tab: string;
}>("setProfileTab");

/**
 * SetCommentsTabEvent is emitted when the viewer changes the
 * tab of the comments tab bar.
 */
export const SetCommentsTabEvent = createViewerEvent<{
  tab: string;
}>("setCommentsTab");

/**
 * SetCommentsOrderByEvent is emitted when the viewer changes the
 * sort order of the comments.
 */
export const SetCommentsOrderByEvent = createViewerEvent<{
  orderBy: string;
}>("setCommentsOrderBy");

/**
 * ViewConversationEvent is emitted when the viewer changes to
 * a single conversation view.
 */
export const ViewConversationEvent = createViewerEvent<{
  from: "FEATURED_COMMENTS" | "COMMENT_STREAM" | "MY_PROFILE";
  commentID: string;
}>("viewConversation");

/**
 * ShowUserPopover is emitted when the viewer clicks
 * on a username which shows the user popover.
 */
export const ShowUserPopoverEvent = createViewerEvent<{
  userID: string;
}>("showUserPopover");

/**
 * ShowAbsoluteTimestamp is emitted when the viewer clicks
 * on the relative timestamp to show the absolute time.
 */
export const ShowAbsoluteTimestampEvent = createViewerEvent(
  "showAbsoluteTimestamp"
);

/**
 * ShowFeaturedCommentTooltipEvent is emitted when the viewer clicks to show the
 * featured comment tooltip.
 */
export const ShowFeaturedCommentTooltipEvent = createViewerEvent(
  "showFeaturedCommentTooltip"
);

/**
 * OpenSortMenuEvent is emitted when the viewer clicks on the sort menu.
 */
export const OpenSortMenuEvent = createViewerEvent("openSortMenu");

/**
 * CreateCommentFocusEvent is emitted when the viewer focus on the RTE to
 * create a comment.
 */
export const CreateCommentFocusEvent = createViewerEvent("createCommentFocus");

/**
 * ViewFullDiscussionEvent is emitted when the viewer exits the single conversation.
 */
export const ViewFullDiscussionEvent = createViewerEvent<{
  commentID: string | null;
}>("viewFullDiscussion");

/**
 * ShowMoreOfConversationEvent is emitted when the viewer reveals more of
 * the parent conversation thread.
 */
export const ShowMoreOfConversationEvent = createViewerNetworkEvent<{
  commentID: string | null;
  success: {};
  error: { message: string; code?: string };
}>("showMoreOfConversation");

/**
 * ShowSharePopoverEvent is emitted when the viewer opens the share popover.
 */
export const ShowSharePopoverEvent = createViewerEvent<{
  commentID: string;
}>("showSharePopover");

/**
 * CopyPermalinkEvent is emitted when the viewer copies the permalink with the button.
 */
export const CopyPermalinkEvent = createViewerEvent<{
  commentID: string;
}>("copyPermalink");

/**
 * ShowReportPopoverEvent is emitted when the viewer opens the report popover.
 */
export const ShowReportPopoverEvent = createViewerEvent<{
  commentID: string;
}>("showReportPopover");

/**
 * ReportCommentEvent is emitted when the viewer reports a comment.
 */
export const ReportCommentEvent = createViewerNetworkEvent<{
  reason: string;
  commentID: string;
  additionalDetails?: string;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("reportComment");

/**
 * ShowReplyFormEvent is emitted when the viewer opens the reply form.
 */
export const ShowReplyFormEvent = createViewerEvent<{
  commentID: string;
}>("showReplyForm");

/**
 * ShowEditFormEvent is emitted when the viewer opens the edit form.
 */
export const ShowEditFormEvent = createViewerEvent<{
  commentID: string;
}>("showEditForm");

/**
 * ViewNewCommentsEvent is emitted when the viewer reveals
 * new live comments.
 */
export const ViewNewCommentsEvent = createViewerEvent<{
  storyID: string;
  count: number;
}>("viewNewComments");

/**
 * ShowMoreRepliesEvent is emitted when the viewer reveals
 * new live replies.
 */
export const ShowMoreRepliesEvent = createViewerEvent<{
  commentID: string;
  count: number;
}>("showMoreReplies");

/**
 * ShowModerationPopoverEvent is emitted when the viewer opens
 * the moderation popover.
 */
export const ShowModerationPopoverEvent = createViewerEvent<{
  commentID: string;
}>("showModerationPopover");

/**
 * GotoModerationEvent is emitted when the viewer goes to
 * moderation.
 */
export const GotoModerationEvent = createViewerEvent<{
  commentID: string;
}>("gotoModeration");
