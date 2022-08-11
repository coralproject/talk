# Client Events Guide

This serves as a guide to events emitted by the javascript via the embed events
hook, as described below in [Viewer Events](#viewer-events).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Viewer Events](#viewer-events)
  - [Viewer Network Events](#viewer-network-events)
- [Event List](#event-list)
  - [Index](#index)
  - [Events](#events)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Viewer Events

_Viewer Events_ are emitted when the viewer performs certain actions.
They can be subscribed to using the `events` parameter in
`Coral.createStreamEmbed`.

```html
<script>
  const CoralStreamEmbed = Coral.createStreamEmbed({
    events: function(events) {
      events.onAny(function(eventName, data) {
        console.log(eventName, data);
      });
    },
  });
</script>
```

Example events:

- `setMainTab {tab: "PROFILE"}`
- `showFeaturedCommentTooltip`
- `viewConversation {from: "FEATURED_COMMENTS", commentID: "c45fb5f5-03f9-49a3-a755-488c698ca0df"}`

### Viewer Network Events

_Viewer Network Events_ are events that involves a network request and thus can succeed or fail. Succeeding events will have a `.success` appended to the event name while failing events have an `.error` appended to the event name.

Moreover _Viewer Network Events_ contains the `rtt` field which indicates the time it needed from initiating the request until the _UI_ has been updated with the response data.

Example events:

```
createComment.success
{
  body: "Hello world!",
  storyID: "238b95ec-2b80-43f4-ab68-a6ea1f4e2584",
  rtt: 307,
  success: {
    id: "6fecfb11-4d0f-4edc-89b7-878a9928addd"
    status: "APPROVED"`
  }
}
```

```
createComment.error
{
  body: "Hi!",
  storyID: "238b95ec-2b80-43f4-ab68-a6ea1f4e2584",
  rtt: 229,
  error: {
    code: "COMMENT_BODY_TOO_SHORT"
    message: "Comment body must have at least 10 characters."
  }
}
```

## Event List

<!-- START docs:events -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN npm run docs:events -->
### Index
- <a href="#addACommentButton">addACommentButton</a>
- <a href="#approveComment">approveComment</a>
- <a href="#banUser">banUser</a>
- <a href="#cancelAccountDeletion">cancelAccountDeletion</a>
- <a href="#changeEmail">changeEmail</a>
- <a href="#changePassword">changePassword</a>
- <a href="#changeUsername">changeUsername</a>
- <a href="#closeMobileToolbar">closeMobileToolbar</a>
- <a href="#closeStory">closeStory</a>
- <a href="#copyPermalink">copyPermalink</a>
- <a href="#createComment">createComment</a>
- <a href="#createCommentFocus">createCommentFocus</a>
- <a href="#createCommentReaction">createCommentReaction</a>
- <a href="#createCommentReply">createCommentReply</a>
- <a href="#editComment">editComment</a>
- <a href="#featureComment">featureComment</a>
- <a href="#gotoModeration">gotoModeration</a>
- <a href="#ignoreUser">ignoreUser</a>
- <a href="#jumpToNextComment">jumpToNextComment</a>
- <a href="#jumpToNextUnseenComment">jumpToNextUnseenComment</a>
- <a href="#jumpToPreviousComment">jumpToPreviousComment</a>
- <a href="#jumpToPreviousUnseenComment">jumpToPreviousUnseenComment</a>
- <a href="#loadMoreAllComments">loadMoreAllComments</a>
- <a href="#loadMoreFeaturedComments">loadMoreFeaturedComments</a>
- <a href="#loadMoreHistoryComments">loadMoreHistoryComments</a>
- <a href="#loginPrompt">loginPrompt</a>
- <a href="#openSortMenu">openSortMenu</a>
- <a href="#openStory">openStory</a>
- <a href="#rejectComment">rejectComment</a>
- <a href="#removeCommentReaction">removeCommentReaction</a>
- <a href="#removeUserIgnore">removeUserIgnore</a>
- <a href="#replyCommentFocus">replyCommentFocus</a>
- <a href="#reportComment">reportComment</a>
- <a href="#requestAccountDeletion">requestAccountDeletion</a>
- <a href="#requestDownloadCommentHistory">requestDownloadCommentHistory</a>
- <a href="#resendEmailVerification">resendEmailVerification</a>
- <a href="#setCommentsOrderBy">setCommentsOrderBy</a>
- <a href="#setCommentsTab">setCommentsTab</a>
- <a href="#setMainTab">setMainTab</a>
- <a href="#setProfileTab">setProfileTab</a>
- <a href="#showAbsoluteTimestamp">showAbsoluteTimestamp</a>
- <a href="#showAllReplies">showAllReplies</a>
- <a href="#showAuthPopup">showAuthPopup</a>
- <a href="#showEditEmailDialog">showEditEmailDialog</a>
- <a href="#showEditForm">showEditForm</a>
- <a href="#showEditPasswordDialog">showEditPasswordDialog</a>
- <a href="#showEditUsernameDialog">showEditUsernameDialog</a>
- <a href="#showFeaturedCommentTooltip">showFeaturedCommentTooltip</a>
- <a href="#showIgnoreUserdDialog">showIgnoreUserdDialog</a>
- <a href="#showModerationPopover">showModerationPopover</a>
- <a href="#showMoreOfConversation">showMoreOfConversation</a>
- <a href="#showMoreReplies">showMoreReplies</a>
- <a href="#showReplyForm">showReplyForm</a>
- <a href="#showReportPopover">showReportPopover</a>
- <a href="#showSharePopover">showSharePopover</a>
- <a href="#showUserPopover">showUserPopover</a>
- <a href="#signOut">signOut</a>
- <a href="#signedIn">signedIn</a>
- <a href="#unfeatureComment">unfeatureComment</a>
- <a href="#unmarkAll">unmarkAll</a>
- <a href="#updateNotificationSettings">updateNotificationSettings</a>
- <a href="#updateStorySettings">updateStorySettings</a>
- <a href="#updateUserMediaSettings">updateUserMediaSettings</a>
- <a href="#viewConversation">viewConversation</a>
- <a href="#viewFullDiscussion">viewFullDiscussion</a>
- <a href="#viewNewComments">viewNewComments</a>
- <a href="#viewNewCommentsNetwork">viewNewCommentsNetwork</a>
- <a href="#viewNewRepliesNetwork">viewNewRepliesNetwork</a>

### Events
- <a id="addACommentButton">**addACommentButton**</a>: This event is emitted when the viewer clicks the add a comment button in alternate oldest view.
- <a id="approveComment">**approveComment.success**, **approveComment.error**</a>: This event is emitted when the viewer approves a comment.
  ```ts
  {
      commentID: string;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="banUser">**banUser.success**, **banUser.error**</a>: This event is emitted when the viewer bans a user.
  ```ts
  {
      userID: string;
      commentID: string;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="cancelAccountDeletion">**cancelAccountDeletion.success**, **cancelAccountDeletion.error**</a>: This event is emitted when the viewer cancels the account deletion.
  ```ts
  {
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="changeEmail">**changeEmail.success**, **changeEmail.error**</a>: This event is emitted when the viewer changes its email.
  ```ts
  {
      oldEmail: string;
      newEmail: string;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="changePassword">**changePassword.success**, **changePassword.error**</a>: This event is emitted when the viewer changes its password.
  ```ts
  {
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="changeUsername">**changeUsername.success**, **changeUsername.error**</a>: This event is emitted when the viewer changes its username.
  ```ts
  {
      oldUsername: string;
      newUsername: string;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="closeMobileToolbar">**closeMobileToolbar**</a>: This event is emitted when the viewer closes to mobile toolbar.
- <a id="closeStory">**closeStory.success**, **closeStory.error**</a>: This event is emitted when the viewer closes the story.
  ```ts
  {
      storyID: string;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="copyPermalink">**copyPermalink**</a>: This event is emitted when the viewer copies the permalink with the button.
  ```ts
  {
      commentID: string;
  }
  ```
- <a id="createComment">**createComment.success**, **createComment.error**</a>: This event is emitted when a top level comment is created.
  ```ts
  {
      storyID: string;
      body: string;
      success: {
          id: string;
          status: COMMENT_STATUS;
      };
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="createCommentFocus">**createCommentFocus**</a>: This event is emitted when the viewer focus on the RTE to create a comment.
- <a id="createCommentReaction">**createCommentReaction.success**, **createCommentReaction.error**</a>: This event is emitted when the viewer reacts to a comment.
  ```ts
  {
      commentID: string;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="createCommentReply">**createCommentReply.success**, **createCommentReply.error**</a>: This event is emitted when a comment reply is created.
  ```ts
  {
      body: string;
      parentID: string;
      success: {
          id: string;
          status: COMMENT_STATUS;
      };
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="editComment">**editComment.success**, **editComment.error**</a>: This event is emitted when the viewer edits a comment.
  ```ts
  {
      body: string;
      commentID: string;
      success: {
          status: COMMENT_STATUS;
      };
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="featureComment">**featureComment.success**, **featureComment.error**</a>: This event is emitted when the viewer features a comment.
  ```ts
  {
      commentID: string;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="gotoModeration">**gotoModeration**</a>: This event is emitted when the viewer goes to moderation.
  ```ts
  {
      commentID: string;
  }
  ```
- <a id="ignoreUser">**ignoreUser.success**, **ignoreUser.error**</a>: This event is emitted when the viewer ignores a user.
  ```ts
  {
      userID: string;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="jumpToNextComment">**jumpToNextComment**</a>: This event is emitted when the viewer triggered the C Key (Next Comment Traversal) functionality.
  ```ts
  {
      source: "keyboard" | "mobileToolbar";
  }
  ```
- <a id="jumpToNextUnseenComment">**jumpToNextUnseenComment**</a>: This event is emitted when the viewer triggered the Z Key (Next Unseen Comment Traversal) functionality.
  ```ts
  {
      source: "keyboard" | "mobileToolbar";
  }
  ```
- <a id="jumpToPreviousComment">**jumpToPreviousComment**</a>: This event is emitted when the viewer triggered the Shift+C Key (Prev Comment Traversal) functionality.
  ```ts
  {
      source: "keyboard" | "mobileToolbar";
  }
  ```
- <a id="jumpToPreviousUnseenComment">**jumpToPreviousUnseenComment**</a>: This event is emitted when the viewer triggered the Shift+Z Key (Prev Unseen Comment Traversal) functionality.
  ```ts
  {
      source: "keyboard" | "mobileToolbar";
  }
  ```
- <a id="loadMoreAllComments">**loadMoreAllComments.success**, **loadMoreAllComments.error**</a>: This event is emitted when the viewer loads more top level comments into the comment stream.
  ```ts
  {
      storyID: string;
      keyboardShortcutsConfig: {
          source: string;
          key: string;
          reverse: boolean;
      } | null;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="loadMoreFeaturedComments">**loadMoreFeaturedComments.success**, **loadMoreFeaturedComments.error**</a>: This event is emitted when the viewer loads more featured comments.
  ```ts
  {
      storyID: string;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="loadMoreHistoryComments">**loadMoreHistoryComments.success**, **loadMoreHistoryComments.error**</a>: This event is emitted when the viewer loads more top level comments into the history comment stream.
  ```ts
  {
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="loginPrompt">**loginPrompt**</a>: This event is emitted when the viewer does an action that will prompt a login dialog.
- <a id="openSortMenu">**openSortMenu**</a>: This event is emitted when the viewer clicks on the sort menu.
- <a id="openStory">**openStory.success**, **openStory.error**</a>: This event is emitted when the viewer opens the story.
  ```ts
  {
      storyID: string;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="rejectComment">**rejectComment.success**, **rejectComment.error**</a>: This event is emitted when the viewer rejects a comment.
  ```ts
  {
      commentID: string;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="removeCommentReaction">**removeCommentReaction.success**, **removeCommentReaction.error**</a>: This event is emitted when the viewer removes its reaction from a comment.
  ```ts
  {
      commentID: string;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="removeUserIgnore">**removeUserIgnore.success**, **removeUserIgnore.error**</a>: This event is emitted when the viewer remove a user from its ignored users list.
  ```ts
  {
      userID: string;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="replyCommentFocus">**replyCommentFocus**</a>: This event is emitted when the viewer focus on the RTE to reply to a comment.
- <a id="reportComment">**reportComment.success**, **reportComment.error**</a>: This event is emitted when the viewer reports a comment.
  ```ts
  {
      reason: string;
      commentID: string;
      additionalDetails?: string | undefined;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="requestAccountDeletion">**requestAccountDeletion.success**, **requestAccountDeletion.error**</a>: This event is emitted when the viewer requests to delete its account.
  ```ts
  {
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="requestDownloadCommentHistory">**requestDownloadCommentHistory.success**, **requestDownloadCommentHistory.error**</a>: This event is emitted when the viewer requests to download its comment history.
  ```ts
  {
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="resendEmailVerification">**resendEmailVerification.success**, **resendEmailVerification.error**</a>: This event is emitted when the viewer request another email verification email.
  ```ts
  {
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="setCommentsOrderBy">**setCommentsOrderBy**</a>: This event is emitted when the viewer changes the sort order of the comments.
  ```ts
  {
      orderBy: string;
  }
  ```
- <a id="setCommentsTab">**setCommentsTab**</a>: This event is emitted when the viewer changes the tab of the comments tab bar.
  ```ts
  {
      tab: string;
  }
  ```
- <a id="setMainTab">**setMainTab**</a>: This event is emitted when the viewer changes the tab of the main tab bar.
  ```ts
  {
      tab: string;
  }
  ```
- <a id="setProfileTab">**setProfileTab**</a>: This event is emitted when the viewer changes the tab of the profile tab bar.
  ```ts
  {
      tab: string;
  }
  ```
- <a id="showAbsoluteTimestamp">**showAbsoluteTimestamp**</a>: This event is emitted when the viewer clicks on the relative timestamp to show the absolute time.
- <a id="showAllReplies">**showAllReplies.success**, **showAllReplies.error**</a>: This event is emitted when the viewer reveals all replies of a comment.
  ```ts
  {
      commentID: string;
      keyboardShortcutsConfig: {
          source: string;
          key: string;
          reverse: boolean;
      } | null;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="showAuthPopup">**showAuthPopup**</a>: This event is emitted when the viewer requests the auth popup.
  ```ts
  {
      view: string;
  }
  ```
- <a id="showEditEmailDialog">**showEditEmailDialog**</a>: This event is emitted when the viewer opens the edit email dialog.
- <a id="showEditForm">**showEditForm**</a>: This event is emitted when the viewer opens the edit form.
  ```ts
  {
      commentID: string;
  }
  ```
- <a id="showEditPasswordDialog">**showEditPasswordDialog**</a>: This event is emitted when the viewer opens the edit password dialog.
- <a id="showEditUsernameDialog">**showEditUsernameDialog**</a>: This event is emitted when the viewer opens the edit username dialog.
- <a id="showFeaturedCommentTooltip">**showFeaturedCommentTooltip**</a>: This event is emitted when the viewer clicks to show the featured comment tooltip.
- <a id="showIgnoreUserdDialog">**showIgnoreUserdDialog**</a>: This event is emitted when the viewer opens the ignore user dialog.
- <a id="showModerationPopover">**showModerationPopover**</a>: This event is emitted when the viewer opens the moderation popover.
  ```ts
  {
      commentID: string;
  }
  ```
- <a id="showMoreOfConversation">**showMoreOfConversation.success**, **showMoreOfConversation.error**</a>: This event is emitted when the viewer reveals more of the parent conversation thread.
  ```ts
  {
      commentID: string | null;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="showMoreReplies">**showMoreReplies**</a>: This event is emitted when the viewer reveals new live replies.
  ```ts
  {
      commentID: string;
      count: number;
  }
  ```
- <a id="showReplyForm">**showReplyForm**</a>: This event is emitted when the viewer opens the reply form.
  ```ts
  {
      commentID: string;
  }
  ```
- <a id="showReportPopover">**showReportPopover**</a>: This event is emitted when the viewer opens the report popover.
  ```ts
  {
      commentID: string;
  }
  ```
- <a id="showSharePopover">**showSharePopover**</a>: This event is emitted when the viewer opens the share popover.
  ```ts
  {
      commentID: string;
  }
  ```
- <a id="showUserPopover">**showUserPopover**</a>: This event is emitted when the viewer clicks on a username which shows the user popover.
  ```ts
  {
      userID: string;
  }
  ```
- <a id="signOut">**signOut.success**, **signOut.error**</a>: This event is emitted when the viewer signs out.
  ```ts
  {
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="signedIn">**signedIn**</a>: This event is emitted when the viewer signed in (not applicable for SSO).
- <a id="unfeatureComment">**unfeatureComment.success**, **unfeatureComment.error**</a>: This event is emitted when the viewer unfeatures a comment.
  ```ts
  {
      commentID: string;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="unmarkAll">**unmarkAll**</a>: This event is emitted when the viewer triggeres the Unmark all functionality.
  ```ts
  {
      source: "keyboard" | "mobileToolbar";
  }
  ```
- <a id="updateNotificationSettings">**updateNotificationSettings.success**, **updateNotificationSettings.error**</a>: This event is emitted when the viewer updates its notification settings.
  ```ts
  {
      onReply?: boolean | null | undefined;
      onFeatured?: boolean | null | undefined;
      onStaffReplies?: boolean | null | undefined;
      onModeration?: boolean | null | undefined;
      digestFrequency?: "NONE" | "DAILY" | "HOURLY" | null | undefined;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="updateStorySettings">**updateStorySettings.success**, **updateStorySettings.error**</a>: This event is emitted when the viewer updates the story settings.
  ```ts
  {
      storyID: string;
      live?: {
          enabled?: boolean | null | undefined;
      } | null | undefined;
      moderation?: "POST" | "PRE" | "SPECIFIC_SITES_PRE" | null | undefined;
      premodLinksEnable?: boolean | null | undefined;
      messageBox?: {
          enabled?: boolean | null | undefined;
          icon?: string | null | undefined;
          content?: string | null | undefined;
      } | null | undefined;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="updateUserMediaSettings">**updateUserMediaSettings.success**, **updateUserMediaSettings.error**</a>: 
  ```ts
  {
      unfurlEmbeds?: boolean | null | undefined;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="viewConversation">**viewConversation**</a>: This event is emitted when the viewer changes to the single conversation view.
  ```ts
  {
      from: "FEATURED_COMMENTS" | "COMMENT_STREAM" | "COMMENT_HISTORY";
      commentID: string;
  }
  ```
- <a id="viewFullDiscussion">**viewFullDiscussion**</a>: This event is emitted when the viewer exits the single conversation.
  ```ts
  {
      commentID: string | null;
  }
  ```
- <a id="viewNewComments">**viewNewComments**</a>: This event is emitted when the viewer reveals new live comments.
  ```ts
  {
      storyID: string;
      count: number;
  }
  ```
- <a id="viewNewCommentsNetwork">**viewNewCommentsNetwork.success**, **viewNewCommentsNetwork.error**</a>: This event is emitted when the viewer reveals new live comments.
  ```ts
  {
      storyID?: string | undefined;
      keyboardShortcutsConfig: {
          source: string;
          key: string;
          reverse: boolean;
      } | null;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
- <a id="viewNewRepliesNetwork">**viewNewRepliesNetwork.success**, **viewNewRepliesNetwork.error**</a>: This event is emitted when the viewer reveals new live replies to comments.
  ```ts
  {
      storyID?: string | undefined;
      keyboardShortcutsConfig: {
          source: string;
          key: string;
          reverse: boolean;
      } | null;
      success: {};
      error: {
          message: string;
          code?: string | undefined;
      };
  }
  ```
<!-- END docs:events -->
