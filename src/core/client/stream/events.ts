/**
 * This file contains Viewer Events of the Embed Stream.
 *
 * Viewer Events can be subscribed to using the `events` parameter in
 * `Coral.createStreamEmbed`.
 *
 * ```html
 *  <script>
 *    const CoralStreamEmbed = Coral.createStreamEmbed({
 *      events: function(events) {
 *        events.onAny(function(eventName, data) {
 *          console.log(eventName, data);
 *        });
 *      },
 *    });
 *  </script>
 * ```
 */

import {
  createViewerEvent,
  createViewerNetworkEvent,
} from "coral-framework/lib/events";

import { COMMENT_STATUS } from "./__generated__/CreateCommentMutation.graphql";
import { DIGEST_FREQUENCY } from "./__generated__/NotificationSettingsContainer_viewer.graphql";
import { MODERATION_MODE } from "./__generated__/UpdateStorySettingsMutation.graphql";

/**
 * This event is emitted when a top level comment is created.
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
 * This event is emitted when a comment reply is created.
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
 * This event is emitted when the viewer edits a comment.
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
 * This event is emitted when the viewer reacts to a comment.
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
 * This event is emitted when the viewer removes its reaction from a comment.
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
 * This event is emitted when the viewer features a comment.
 */
export const FeatureCommentEvent = createViewerNetworkEvent<{
  commentID: string;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("featureComment");

/**
 * This event is emitted when the viewer unfeatures a comment.
 */
export const UnfeatureCommentEvent = createViewerNetworkEvent<{
  commentID: string;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("unfeatureComment");

/**
 * This event is emitted when the viewer approves a comment.
 */
export const ApproveCommentEvent = createViewerNetworkEvent<{
  commentID: string;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("approveComment");

/**
 * This event is emitted when the viewer rejects a comment.
 */
export const RejectCommentEvent = createViewerNetworkEvent<{
  commentID: string;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("rejectComment");

/**
 * This event is emitted when the viewer bans a user.
 */
export const BanUserEvent = createViewerNetworkEvent<{
  userID: string;
  commentID: string;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("banUser");

/**
 * This event is emitted when the viewer ignores a user.
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
 * This event is emitted when the viewer remove a user from
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
 * This event is emitted when the viewer signs out.
 */
export const SignOutEvent = createViewerNetworkEvent<{
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("signOut");

/**
 * This event is emitted when the viewer
 * signed in (not applicable for SSO).
 */
export const SignedInEvent = createViewerEvent("signedIn");

/**
 * This event is emitted when the viewer updates its
 * notification settings.
 */
export const UpdateNotificationSettingsEvent = createViewerNetworkEvent<{
  onReply?: boolean | null;
  onFeatured?: boolean | null;
  onStaffReplies?: boolean | null;
  onModeration?: boolean | null;
  digestFrequency?: DIGEST_FREQUENCY | null;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("updateNotificationSettings");

export const UpdateUserMediaSettingsEvent = createViewerNetworkEvent<{
  unfurlEmbeds?: boolean | null;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("updateUserMediaSettings");

/**
 * This event is emitted when the viewer updates the story settings.
 */
export const UpdateStorySettingsEvent = createViewerNetworkEvent<{
  storyID: string;
  live?: {
    enabled?: boolean | null;
  } | null;
  moderation?: MODERATION_MODE | null;
  premodLinksEnable?: boolean | null;
  messageBox?: {
    enabled?: boolean | null;
    icon?: string | null;
    content?: string | null;
  } | null;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("updateStorySettings");

/**
 * This event is emitted when the viewer closes the story.
 */
export const CloseStoryEvent = createViewerNetworkEvent<{
  storyID: string;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("closeStoryEvent");

/**
 * This event is emitted when the viewer opens the story.
 */
export const OpenStoryEvent = createViewerNetworkEvent<{
  storyID: string;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("openStoryEvent");

/**
 * This event is emitted when the viewer loads more
 * featured comments.
 */
export const LoadMoreFeaturedCommentsEvent = createViewerNetworkEvent<{
  storyID: string;
  success: {};
  error: { message: string; code?: string };
}>("loadMoreFeaturedComments");

/**
 * This event is emitted when the viewer loads more
 * top level comments into the comment stream.
 */
export const LoadMoreAllCommentsEvent = createViewerNetworkEvent<{
  storyID: string;
  keyboardShortcutsConfig: {
    source: string;
    key: string;
    reverse: boolean;
  } | null;
  success: {};
  error: { message: string; code?: string };
}>("loadMoreAllComments");

/**
 *
 * This event is emitted when the viewer reveals
 * new live comments.
 */
export const ViewNewCommentsNetworkEvent = createViewerNetworkEvent<{
  storyID?: string;
  keyboardShortcutsConfig: {
    source: string;
    key: string;
    reverse: boolean;
  } | null;
  success: {};
  error: { message: string; code?: string };
}>("viewNewCommentsNetwork");

/**
 *
 * This event is emitted when the viewer reveals
 * new live replies to comments.
 */
export const ViewNewRepliesNetworkEvent = createViewerNetworkEvent<{
  storyID?: string;
  keyboardShortcutsConfig: {
    source: string;
    key: string;
    reverse: boolean;
  } | null;
  success: {};
  error: { message: string; code?: string };
}>("viewNewRepliesNetwork");

/**
 * This event is emitted when the viewer loads more
 * top level comments into the history comment stream.
 */
export const LoadMoreHistoryCommentsEvent = createViewerNetworkEvent<{
  success: {};
  error: { message: string; code?: string };
}>("loadMoreHistoryComments");

/**
 * This event is emitted when the viewer reveals
 * all replies of a comment.
 */
export const ShowAllRepliesEvent = createViewerNetworkEvent<{
  commentID: string;
  keyboardShortcutsConfig: {
    source: string;
    key: string;
    reverse: boolean;
  } | null;
  success: {};
  error: { message: string; code?: string };
}>("showAllReplies");

/**
 *
 * This event is emitted when the viewer clicks the add a comment
 * button in alternate oldest view.
 */
export const AddACommentButtonEvent = createViewerEvent("addACommentButton");

/**
 * This event is emitted when the viewer does an
 * action that will prompt a login dialog.
 */
export const LoginPromptEvent = createViewerEvent("loginPrompt");

/**
 * This event is emitted when the viewer requests the auth popup.
 */
export const ShowAuthPopupEvent = createViewerEvent<{
  view: string;
}>("showAuthPopup");

/**
 * This event is emitted when the viewer changes the
 * tab of the main tab bar.
 */
export const SetMainTabEvent = createViewerEvent<{
  tab: string;
}>("setMainTab");

/**
 * This event is emitted when the viewer changes the
 * tab of the profile tab bar.
 */
export const SetProfileTabEvent = createViewerEvent<{
  tab: string;
}>("setProfileTab");

/**
 * This event is emitted when the viewer changes the
 * tab of the comments tab bar.
 */
export const SetCommentsTabEvent = createViewerEvent<{
  tab: string;
}>("setCommentsTab");

/**
 * This event is emitted when the viewer changes the
 * sort order of the comments.
 */
export const SetCommentsOrderByEvent = createViewerEvent<{
  orderBy: string;
}>("setCommentsOrderBy");

/**
 * This event is emitted when the viewer changes to
 * the single conversation view.
 */
export const ViewConversationEvent = createViewerEvent<{
  from: "FEATURED_COMMENTS" | "COMMENT_STREAM" | "COMMENT_HISTORY";
  commentID: string;
}>("viewConversation");

/**
 * This event is emitted when the viewer clicks
 * on a username which shows the user popover.
 */
export const ShowUserPopoverEvent = createViewerEvent<{
  userID: string;
}>("showUserPopover");

/**
 * This event is emitted when the viewer clicks
 * on the relative timestamp to show the absolute time.
 */
export const ShowAbsoluteTimestampEvent = createViewerEvent(
  "showAbsoluteTimestamp"
);

/**
 * This event is emitted when the viewer clicks to show the
 * featured comment tooltip.
 */
export const ShowFeaturedCommentTooltipEvent = createViewerEvent(
  "showFeaturedCommentTooltip"
);

/**
 * This event is emitted when the viewer clicks on the sort menu.
 */
export const OpenSortMenuEvent = createViewerEvent("openSortMenu");

/**
 * This event is emitted when the viewer focus on the RTE to
 * create a comment.
 */
export const CreateCommentFocusEvent = createViewerEvent("createCommentFocus");

/**
 * This event is emitted when the viewer focus on the RTE to
 * reply to a comment.
 */
export const ReplyCommentFocusEvent = createViewerEvent("replyCommentFocus");

/**
 * This event is emitted when the viewer exits the single conversation.
 */
export const ViewFullDiscussionEvent = createViewerEvent<{
  commentID: string | null;
}>("viewFullDiscussion");

/**
 * This event is emitted when the viewer reveals more of
 * the parent conversation thread.
 */
export const ShowMoreOfConversationEvent = createViewerNetworkEvent<{
  commentID: string | null;
  success: {};
  error: { message: string; code?: string };
}>("showMoreOfConversation");

/**
 * This event is emitted when the viewer opens the share popover.
 */
export const ShowSharePopoverEvent = createViewerEvent<{
  commentID: string;
}>("showSharePopover");

/**
 * This event is emitted when the viewer copies the permalink with the button.
 */
export const CopyPermalinkEvent = createViewerEvent<{
  commentID: string;
}>("copyPermalink");

/**
 * This event is emitted when the viewer opens the report popover.
 */
export const ShowReportPopoverEvent = createViewerEvent<{
  commentID: string;
}>("showReportPopover");

/**
 * This event is emitted when the viewer reports a comment.
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
 * This event is emitted when the viewer opens the reply form.
 */
export const ShowReplyFormEvent = createViewerEvent<{
  commentID: string;
}>("showReplyForm");

/**
 * This event is emitted when the viewer opens the edit form.
 */
export const ShowEditFormEvent = createViewerEvent<{
  commentID: string;
}>("showEditForm");

/**
 * This event is emitted when the viewer reveals
 * new live comments.
 */
export const ViewNewCommentsEvent = createViewerEvent<{
  storyID: string;
  count: number;
}>("viewNewComments");

/**
 * This event is emitted when the viewer reveals
 * new live replies.
 */
export const ShowMoreRepliesEvent = createViewerEvent<{
  commentID: string;
  count: number;
}>("showMoreReplies");

/**
 * This event is emitted when the viewer opens
 * the moderation popover.
 */
export const ShowModerationPopoverEvent = createViewerEvent<{
  commentID: string;
}>("showModerationPopover");

/**
 * This event is emitted when the viewer goes to
 * moderation.
 */
export const GotoModerationEvent = createViewerEvent<{
  commentID: string;
}>("gotoModeration");

/**
 * This event is emitted when the viewer opens the
 * edit username dialog.
 */
export const ShowEditUsernameDialogEvent = createViewerEvent(
  "showEditUsernameDialog"
);

/**
 * This event is emitted when the viewer opens the
 * edit email dialog.
 */
export const ShowEditEmailDialogEvent = createViewerEvent(
  "showEditEmailDialog"
);

/**
 * This event is emitted when the viewer opens the
 * edit password dialog.
 */
export const ShowEditPasswordDialogEvent = createViewerEvent(
  "showEditPasswordDialog"
);

/**
 * This event is emitted when the viewer opens the
 * ignore user dialog.
 */
export const ShowIgnoreUserdDialogEvent = createViewerEvent(
  "showIgnoreUserdDialog"
);

/**
 * This event is emitted when the viewer triggered the
 * C Key (Next Comment Traversal) functionality.
 */
export const JumpToNextCommentEvent = createViewerEvent<{
  source: "keyboard" | "mobileToolbar";
}>("jumpToNextComment");

/**
 * This event is emitted when the viewer triggered the
 * Shift+C Key (Prev Comment Traversal) functionality.
 */
export const JumpToPreviousCommentEvent = createViewerEvent<{
  source: "keyboard" | "mobileToolbar";
}>("jumpToPreviousComment");

/**
 * This event is emitted when the viewer triggered the
 * Z Key (Next Unseen Comment Traversal) functionality.
 */
export const JumpToNextUnseenCommentEvent = createViewerEvent<{
  source: "keyboard" | "mobileToolbar";
}>("jumpToNextUnseenComment");

/**
 * This event is emitted when the viewer triggered the
 * Shift+Z Key (Prev Unseen Comment Traversal) functionality.
 */
export const JumpToPreviousUnseenCommentEvent = createViewerEvent<{
  source: "keyboard" | "mobileToolbar";
}>("jumpToPreviousUnseenComment");

/**
 * This event is emitted when the viewer triggeres
 * the Unmark all functionality.
 */
export const UnmarkAllEvent = createViewerEvent<{
  source: "keyboard" | "mobileToolbar";
}>("unmarkAll");

/**
 * This event is emitted when the viewer closes to mobile
 * toolbar.
 */
export const CloseMobileToolbarEvent = createViewerEvent("closeMobileToolbar");

/**
 * This event is emitted when the viewer request another
 * email verification email.
 */
export const ResendEmailVerificationEvent = createViewerNetworkEvent<{
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("resendEmailVerification");

/**
 * This event is emitted when the viewer changes its username.
 */
export const ChangeUsernameEvent = createViewerNetworkEvent<{
  oldUsername: string;
  newUsername: string;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("changeUsername");

/**
 * This event is emitted when the viewer changes its email.
 */
export const ChangeEmailEvent = createViewerNetworkEvent<{
  oldEmail: string;
  newEmail: string;
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("changeEmail");

/**
 * This event is emitted when the viewer changes its password.
 */
export const ChangePasswordEvent = createViewerNetworkEvent<{
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("changePassword");

/**
 * This event is emitted when the viewer requests to download
 * its comment history.
 */
export const RequestDownloadCommentHistoryEvent = createViewerNetworkEvent<{
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("requestDownloadCommentHistory");

/**
 * This event is emitted when the viewer requests to delete
 * its account.
 */
export const RequestAccountDeletionEvent = createViewerNetworkEvent<{
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("requestAccountDeletionEvent");

/**
 * This event is emitted when the viewer cancels the
 * account deletion.
 */
export const CancelAccountDeletionEvent = createViewerNetworkEvent<{
  success: {};
  error: {
    message: string;
    code?: string;
  };
}>("cancelAccountDeletionEvent");
