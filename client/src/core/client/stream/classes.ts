const CLASSES = {
  /**
   * app is the container of the app.
   */
  app: "coral coral-stream",

  /**
   * guidlines represents the box containing the guidlines.
   */
  guidelines: {
    container: "coral coral-guidelines",
    content: "coral coral-guidelines-content",
  },

  /**
   * guidlines represents the box containing the guidlines.
   */
  announcement: "coral coral-announcement",

  /**
   * closedSitewide represents the box containing the message when comments
   * are closed sitewide.
   */
  closedSitewide: "coral coral-closedSitewide",

  /**
   * sortMenu contains the dropdown to sort the comments.
   */
  sortMenu: "coral coral-sortMenu",

  /**
   * counter to show e.g. the amount of comments.
   */
  counter: "coral coral-counter",

  /**
   * commentForm is the border div around the RTE.
   */
  commentForm: "coral coral-commentForm",

  /**
   * rte represents the rich-text-editor
   */
  rte: {
    $root: "coral coral-rte",
    content: "coral coral-rte-content",
    placeholder: "coral coral-rte-placeholder",
    toolbar: "coral coral-rte-toolbar",
    container: "coral coral-rte-container",
    fakeContainer: "coral coral-rte-fake-container",
  },

  /**
   * tabBar is all the components in the top tab bar selector.
   */
  tabBar: {
    /**
     * $root represents the container for the tab buttons.
     */
    $root: "coral coral-tabBar",

    /**
     * comments is the button for the "Comments" tab.
     */
    comments: "coral coral-tabBar-tab coral-tabBar-comments",

    /**
     * myProfile is the button for the "My Profile" tab.
     */
    myProfile: "coral coral-tabBar-tab coral-tabBar-myProfile",

    discussions: "coral coral-tabBar-tab coral-tabBar-discussions",

    /**
     * configure is the button for the "Configure" tab.
     */
    configure: "coral coral-tabBar-tab coral-tabBar-configure",

    activeTab: "coral-tabBar-tab-active",
  },

  /**
   * tabBarComments is all the components in the comments secondary tab bar selector.
   */
  tabBarComments: {
    row: "coral coral-tabBarSecondary-row",
    /**
     * $root represents the container for the tab buttons.
     */
    $root: "coral coral-tabBarSecondary coral-tabBarComments",

    /**
     * allComments is the button for the "All Comments" tab.
     */
    allComments:
      "coral coral-tabBarSecondary-tab coral-tabBarComments-allComments",

    /**
     * featured is the button for the "Featured Comments" tab.
     */
    featured: "coral coral-tabBarSecondary-tab coral-tabBarComments-featured",

    /**
     * featuredTooltip is the tooltip next to the featured tab.
     */
    featuredTooltip: "coral coral-tabBarComments-featuredTooltip",

    activeTab: "coral-tabBarSecondary-tab-active",
  },

  /**
   * tabBarMyProfile is all the components in the my profile secondary tab bar selector.
   */
  tabBarMyProfile: {
    /**
     * $root represents the container for the tab buttons.
     */
    $root: "coral coral-tabBarSecondary coral-tabBarMyProfile",

    /**
     * myComments is the button for the "My Comments" tab.
     */
    myComments:
      "coral coral-tabBarSecondary-tab coral-tabBarMyProfile-myComments",

    /**
     * preferences is the button for the "Preferences" tab.
     */
    preferences:
      "coral coral-tabBarSecondary-tab coral-tabBarMyProfile-preferences",

    /**
     * notifications is the button for the "Notifications" tab.
     */
    notifications:
      "coral coral-tabBarSecondary-tab coral-tabBarMyProfile-notifications",

    active: "coral-tabBarSecondary-tab-active",
    /**
     * settings is the button for the "Settings" tab.
     */
    settings: "coral coral-tabBarSecondary-tab coral-tabBarMyProfile-settings",
  },

  /**
   * createComment is the comment creation box where a user can write a comment.
   */
  createComment: {
    /**
     * $root represents the container for the new comments box.
     */
    $root: "coral coral-createComment",

    /**
     * message is the box containing the messages configured in the story.
     */
    message: "coral coral-createComment-message",

    /**
     * closed is the box containing the message when the story is closed.
     */
    closed: "coral coral-createComment-closed",

    /**
     * submit is the button for submitting a new comment.
     */
    submit: "coral coral-createComment-submit",

    /**
     * signIn is the button for submitting a new comment and signing in.
     */
    signIn: "coral coral-createComment-signIn",

    /**
     * inReview is the message notifying the user that the posted comment is
     * in review.
     */
    inReview: "coral coral-createComment-inReview",

    /**
     * rejected is the message notifying the user that the posted comment is
     * rejected.
     */
    rejected: "coral coral-createComment-rejected",

    /**
     * dismissButton is the button to dismiss the in review message.
     */
    dismissButton: "coral coral-createComment-dismissButton",
    /**
     * cancel is the button for cancelling the post.
     */
    cancel: "coral coral-createComment-cancel",
  },

  /**
   * replyComment is the comment creation box where a user can write a reply on
   * a specific comment.
   */
  createReplyComment: {
    /**
     * $root represents the container for the new reply box.
     */
    $root: "coral coral-createReplyComment",

    /**
     * inReview is the message notifying the user that the posted comment is
     * in review.
     */
    inReview: "coral coral-createReplyComment-inReview",

    /**
     * submit is the button for submitting a new reply.
     */
    submit: "coral coral-createReplyComment-submit",

    /**
     * cancel is the button for cancelling the reply.
     */
    cancel: "coral coral-createReplyComment-cancel",

    /**
     * dimiss is the button to dismiss the message after submit.
     */
    dismiss: "coral coral-createReplyComment-dismiss",

    /**
     * replyTo shows the author of the parent comment.
     */
    replyTo: {
      $root: "coral coral-createReplyComment-replyTo",
      text: "coral coral-createReplyComment-replyToText",
      username: "coral coral-createReplyComment-replyToUsername",
    },
  },

  /**
   * editComment is the comment edit box where a user can edit his comment.
   */
  editComment: {
    /**
     * $root represents the container for the edit box.
     */
    $root: "coral coral-editComment",

    /**
     * inReview is the message notifying the user that the edited comment is
     * in review.
     */
    inReview: "coral coral-editComment-inReview",

    /**
     * remainingTime is the message telling the user the remaining time.
     */
    remainingTime: "coral coral-editComment-remainingTime",

    /**
     * expiredTime appears when the comment can no longer be edited.
     */
    expiredTime: "coral coral-editComment-expiredTime",

    /**
     * submit is the button for submitting the edit.
     */
    submit: "coral coral-editComment-submit",

    /**
     * close is the button for closing the edit after it expired.
     */
    close: "coral coral-editComment-close",

    /**
     * cancel is the button for cancelling the edit.
     */
    cancel: "coral coral-editComment-cancel",

    /**
     * dimiss is the button to dismiss the message after submit.
     */
    dismiss: "coral coral-editComment-dismiss",
  },

  /**
   * comment is the visual representation of a Comment.
   */
  comment: {
    /**
     * $root represents the container containing a given Comment.
     */
    $root: "coral coral-comment",

    /**
     * highlight is attached to the comment container if the single
     * conversation view is shown for this comment.
     */
    highlight: "coral coral-comment-highlight",

    notSeen: "coral-comment-notSeen",
    focus: "coral-comment-focus",

    /**
     * reacted signifies the number of reactions of the comment.
     * The no of reactions is appended: e.g. `coral-reacted-1`.
     */
    reacted: "coral coral-reacted",

    /**
     * collapseToggle is the button to collapse and expand the display of a comment.
     */
    collapseToggle: {
      $root: "coral coral-comment-collapse-toggle",
      icon: "coral coral-comment-collapse-toggle-icon",
      indent: "coral coral-comment-collapse-toggle-indent",
      collapsed: "coral coral-comment-collapse-toggle-collapsed",
    },

    /**
     * topBar is the uppper bar of the comment.
     */
    topBar: {
      /**
       * $root represents the container of the top bar.
       */
      $root: "coral coral-comment-topBar",

      /**
       * username is the text display for any given Username in the system.
       */
      username: "coral coral-username coral-comment-username",

      /**
       * timestamp is the text that contains the time since the comment was
       * published.
       */
      timestamp: "coral coral-timestamp coral-comment-timestamp",

      /**
       * edited is the text that indicated that a comment was edited.
       */
      edited: "coral coral-comment-edited",

      /**
       * userTag can be used to target a tag associated with a User.
       */
      userTag: "coral coral-userTag coral-comment-userTag",

      /**
       * userBadge can be used to target a badge associated with a User.
       */
      userBadge: "coral coral-userBadge coral-comment-userBadge",

      /**
       * commentTag can be used to target a tag associated with a Comment.
       */
      commentTag: "coral coral-commentTag coral-comment-commentTag",

      featuredTag:
        "coral coral-commentTag coral-comment-commentTag coral-featuredTag coral-comment-featuredTag",

      /**
       * caretButton can be used to target the caret that opens the moderation dropdown.
       */
      caretButton: "coral coral-comment-caret",

      /**
       * editButton can be used to target the edit button.
       */
      editButton: "coral coral-comment-editButton",
    },

    /**
     * content is the html text body of the comment.
     */
    content: "coral coral-content coral-comment-content",

    /**
     * readMoreOfConversation is the link that continues the
     * thread of the conversation on a deeper level.
     */
    readMoreOfConversation: "coral coral-comment-readMoreOfConveration",

    /**
     * inReplyTo shows the author of the parent comment.
     */
    inReplyTo: {
      $root: "coral coral-comment-inReplyTo",
      text: "coral coral-comment-inReplyToText",
      username: "coral coral-comment-inReplyToUsername",
    },

    /**
     * actionBar is the lower bar of the comment.
     */
    actionBar: {
      /**
       * $root represents the container of action bar.
       */
      $root: "coral coral-comment-actionBar",
      /**
       * reactButton is the reaction button.
       */
      reactButton: "coral coral-reactButton coral-comment-reactButton",
      /**
       * reactedButton is the class added to the reaction button
       * when the viewer has already reacted to the comment.
       */
      reactedButton: "coral-reactedButton coral-comment-reactedButton",
      /**
       * replyButton is button that triggers the reply form.
       */
      replyButton: "coral coral-comment-replyButton",
      /**
       * shareButton is the button that will show the permalink popover.
       */
      shareButton: "coral coral-comment-shareButton",
      /**
       * reportButton is the button that triggers the report feature.
       */
      reportButton: "coral coral-reportButton coral-comment-reportButton",
      /**
       * reportedButton is added to report button when the viewer
       * has already reported the comment.
       */
      reportedButton: "coral-reportedButton coral-comment-reportedButton",
    },

    avatar: "coral coral-comment-avatar",

    /**
     * indentation classes for the different levels.
     */
    indent: (level: number) => `coral coral-indent coral-indent-${level}`,
  },

  /**
   * moderationRejectedTombstone is shown to the moderator when a comment got rejected.
   */
  moderationRejectedTombstone: {
    $root: "coral coral-moderationRejectedTombstone",
    goToModerateButton:
      "coral coral-moderationRejectedTombstone-goToModerateButton",
  },
  /**
   * rejectedTombstone is shown when a comment has been rejected.
   */
  rejectedTombstone: "coral coral-rejectedTombstone",

  /**
   * deletedTombstone is shown when a comment has been deleted.
   */
  deletedTombstone: "coral coral-deletedTombstone",

  /**
   * ignoredTombstown is shown when a comment got ignored.
   */
  ignoredTombstone: "coral coral-ignoredTombstone",

  /**
   * replyList represents the list of replies to a comment.
   */
  replyList: {
    /**
     * showAllButton is the button to show all replies.
     */
    showAllButton: "coral coral-replyList-showAllButton",
    /**
     * showAllButton is the button to show incoming live replies.
     */
    showMoreReplies: "coral coral-replyList-showMoreButton",
  },

  /**
   * comment is the visual representation of a featured comment.
   */
  featuredComment: {
    /**
     * $root represents the container containing a featured comment.
     */
    $root: "coral coral-featuredComment",

    /**
     * authorBar is the uppper bar of the comment.
     */
    authorBar: {
      $root: "coral coral-featuredComment-authorBar",

      /**
       * username is the text display for any given Username in the system.
       */
      username: "coral coral-username coral-comment-username",

      /**
       * timestamp is the text that contains the time since the comment was
       * published.
       */
      timestamp: "coral coral-timestamp coral-comment-timestamp",

      /**
       * userTag can be used to target a tag associated with a User.
       */
      userTag: "coral coral-userTag coral-comment-userTag",
    },

    /**
     * content is the html text body of the featured comment.
     */
    content: "coral coral-content coral-featuredComment-content",

    /**
     * actionBar is the lower bar of the featured comment.
     */
    actionBar: {
      /**
       * $root represents the container of action bar.
       */
      $root: "coral coral-featuredComment-actionBar",

      /**
       * replies indicates the amount of replies this comment has.
       */
      replies: "coral coral-featuredComment-replies",

      /**
       * replies indicates the amount of replies this comment has.
       */
      repliesDivider: "coral coral-featuredComment-replies-divider",

      /**
       * reactButton is the reaction button.
       */
      reactButton: "coral coral-reactButton coral-featuredComment-reactButton",
      /**
       * reactedButton is the class added to the reaction button
       * when the viewer has already reacted to the comment.
       */
      reactedButton: "coral-reactedButton coral-featuredComment-reactedButton",
      /**
       * goToConversation is the link that leads to the whole conversation.
       */
      goToConversation: "coral coral-featuredComment-goToConversationButton",
    },
  },

  /**
   * streamFooter is the links that appear at the bottom of the comments stream
   */
  streamFooter: {
    /**
     * root is the container for all of the links
     */
    $root: "coral coral-streamFooter",

    /**
     * profileLink is the "profile and replies" link
     */
    profileLink: "coral coral-streamFooter-link coral-streamFooter-profileLink",

    /**
     * discussionsLink is the "more discussions" link
     */
    discussionsLink:
      "coral coral-streamFooter-link coral-streamFooter-discussionsLink",

    /**
     * commentsTopLink is the "top of comments" link
     */
    commentsTopLink:
      "coral coral-streamFooter-link coral-streamFooter-commentsTopLink",

    /**
     * articleTopLink is the "top of comments" link
     */
    articleTopLink:
      "coral coral-streamFooter-link coral-streamFooter-articleTopLink",
  },

  /**
   * userPopover is the popover that appears when clicking on the username.
   */
  userPopover: {
    /**
     * $root is the container of the user popover.
     */
    $root: "coral coral-userPopover",
    /**
     * username that is rendeed inside the user popover.
     */
    username: "coral coral-username coral-userPopover-username",
    /**
     * ignoreButton that will trigger the ignore user popover.
     */
    ignoreButton: "coral coral-userPopover-ignoreButton",
  },

  /**
   * ignoreUserPopover is the popover that allow the
   * viewer to ignore a user.
   */
  ignoreUserPopover: {
    /**
     * $root is the container of the ignore user popover.
     */
    $root: "coral coral-ignoreUserPopover",
    cancelButton: "coral coral-ignoreUserPopover-cancelButton",
    ignoreButton: "coral coral-ignoreUserPopover-ignoreButton",
  },

  /**
   * sharePopover is the popover that shows the permalink of the comment.
   */
  sharePopover: {
    $root: "coral coral-sharePopover",
    copyButton:
      "coral coral-sharePopover-copyButotn coral-sharePopover-copyButton",
  },

  /**
   * reportPopover is the popover that appears when the viewer clicks on the
   * report button.
   */
  reportPopover: {
    $root: "coral coral-reportPopover",
    closeButton: "coral coral-reportPopover-closeButton",
    cancelButton: "coral coral-reportPopover-cancelButton",
    submitButton: "coral coral-reportPopover-submitButton",
    copyButton: "coral coral-reportPopover-copyButton",
  },

  /**
   * moderationDropdown is the dropdown that appears when clicking on the
   * caret as a priviledged user (at least moderator).
   */
  moderationDropdown: {
    $root: "coral coral-moderationDropdown",
    approveButton:
      "coral coral-dropdownButton coral-moderationDropdown-approveButton",
    approvedButton:
      "coral coral-dropdownButton coral-moderationDropdown-approveedButton",
    rejectButton:
      "coral coral-dropdownButton coral-moderationDropdown-rejectButton",
    rejectedButton:
      "coral coral-dropdownButton coral-moderationDropdown-rejectedButton",
    featureButton:
      "coral coral-dropdownButton coral-moderationDropdown-featureButton",
    unfeatureButton:
      "coral coral-dropdownButton coral-moderationDropdown-unfeatureButton",
    banUserButton:
      "coral coral-dropdownButton coral-moderationDropdown-banUserButton",
    bannedButton:
      "coral coral-dropdownButton coral-moderationDropdown-bannedButton",
    goToModerateButton:
      "coral coral-dropdownButton coral-moderationDropdown-goToModerateButton",
  },

  /**
   * banUserPopover is the popover that allows the viewer to ban users.
   */
  banUserPopover: {
    $root: "coral coral-banUserPopover",
    cancelButton: "coral coral-banUserPopover-cancelButton",
    banButton: "coral coral-banUserPopover-banButton",
  },

  /**
   * viewerBox is the box that indicates which user is logged in and
   * provides login, signout or register functionality.
   */
  viewerBox: {
    $root: "coral coral-viewerBox",
    logoutButton: "coral coral-viewerBox-logoutButton",
    signInButton: "coral coral-viewerBox-signInButton",
    registerButton: "coral coral-viewerBox-registerButton",
    username: "coral coral-viewerBox-username",
    joinText: "coral coral-viewerBox-joinText",
    actionButtons: "coral coral-viewerBox-actionButtons",
    usernameLabel: "coral coral-viewerBox-usernameLabel",
    usernameContainer: "coral coral-viewerBox-usernameContainer",
  },

  /**
   * comments tab pane is the default tab pane.
   */
  commentsTabPane: {
    /**
     * $root is the container for the comments tab pane.
     */
    $root: "coral coral-comments",
    /**
     * authenticated will indicate that the user is logged in.
     */
    authenticated: "coral coral-authenticated",
    /**
     * unauthenticated will indicate that the user hasn't logged in yet.
     */
    unauthenticated: "coral coral-unauthenticated",
  },
  /**
   * allCommentsTabPane is the tab pane that shows all comments.
   */
  allCommentsTabPane: {
    $root: "coral coral-allComments",
    /**
     * loadMoreButton is the button to paginate.
     */
    loadMoreButton:
      "coral coral-loadMoreButton coral-allComments-loadMoreButton",
    /**
     * viewNewButton is the button that reveals newer comments.
     */
    viewNewButton: "coral coral-allComments-viewNewButton",
  },

  /**
   * featuredCommentsTabPane is the tab pane that shows featured comments.
   */
  featuredCommentsTabPane: {
    $root: "coral coral-featuredComments",
    loadMoreButton:
      "coral coral-loadMoreButton coral-featuredComments-loadMoreButton",
  },

  /**
   * permalinkView is the tab pane that shows the conversation of a comment.
   */
  permalinkView: {
    /**
     * $root is the container for the permalink tab pane.
     */
    $root: "coral coral-permalink",
    /**
     * authenticated will be applied to the container when the user is logged in.
     */
    authenticated: "coral-authenticated",
    /**
     * unauthenticated will be applied to the container when the user has not logged in yet.
     */
    unauthenticated: "coral-unauthenticated",

    /**
     * viewFullDiscussionButton is the button that leads to the full comment stream.
     */
    viewFullDiscussionButton: "coral coral-permalink-viewFullDiscussionButton",
  },

  /**
   * conversationThread shows the thread of comments that lead to the permalinked comment.
   */
  conversationThread: {
    $root: "coral coral-conversationThread",
    /**
     * rootParent is the root comment that is shown in the thread before it has been
     * expanded.
     */
    rootParent: {
      $root: "coral coral-rootParent",
      username: "coral coral-username coral-rootParent-username",
      timestamp: "coral coral-timestamp coral-rootParent-timestamp",
      userTag: "coral coral-userTag coral-rootParent-userTag",
    },
    /**
     * showMore is the button that reveals all comments between root parent and highlighted comment.
     */
    showMore: "coral coral-conversationThread-showMore",
    /**
     * highlighted is the comment that is targeted by the permalink.
     */
    hightlighted: "coral coral-conversationThread-highlighted",
  },

  /**
   * myProfileTabPane is the tab pane that shows the profile of the viewer.
   */
  myProfileTabPane: {
    $root: "coral coral-myProfile",
  },

  discussionsTabPane: {
    $root: "coral coral-discussions",
  },

  /**
   * myUsername is the username part of my profile.
   */
  myUsername: {
    title: "coral coral-myUsername-title",
    username: "coral coral-myUsername",
    editButton: "coral coral-myUsername-editButton",
    change: "coral coral-myUsername-change",
    tooSoon: "coral-myUsername-tooSoon",
    form: {
      $root: "coral coral-changeMyUsername",
      heading: "coral coral-changeMyUsername-heading",
      description: "coral coral-changeMyUsername-description",
      label: "coral coral-changeMyUsername-label",
      username: "coral coral-changeMyUsername-username",
      cancelButton: "coral coral-changeMyUsername-cancelButton",
      saveButton: "coral coral-changeMyUsername-saveButton",
      closeButton: "coral coral-changeMyUsername-closeButton",
      footer: "coral coral-changeMyUsername-footer",
      errorMessage:
        "coral coral-changeMyUsername-errorMessage coral-changeMyEmail-errorMessage",
      successMessage: "coral coral-changeMyUsername-successMessage",
      successCallOut: "coral coral-changeMyUsername-successCallOut",
    },
  },

  /**
   * myUsername is the email part of my profile.
   */
  myEmail: {
    email: "coral coral-myEmail",
    title: "coral coral-myEmail-title",
    unverified: "coral coral-myEmail-unverified",
    editButton: "coral coral-myEmail-editButton",
    form: {
      $root: "coral coral-changeMyEmail",
      header: "coral coral-changeMyEmail-header",
      footer: "coral coral-changeMyEmail-footer",
      currentEmail: "coral coral-myEmail-currentEmail",
      desc: "coral coral-changeMyEmail-desc",
      cancelButton: "coral coral-changeMyEmail-cancelButton",
      saveButton: "coral coral-changeMyEmail-saveButton",
      errorMessage: "coral coral-changeMyEmail-errorMessage",
    },
  },

  /**
   * myUsername is the verify email part of my profile.
   */
  verifyEmail: {
    $root: "coral coral-verifyEmail",
    container: "coral coral-verifyEmail-container",
    content: "coral coral-verifyEmail-content",
    title: "coral coral-verifyEmail-title",
    resendButton: "coral coral-verifyEmail-resendButton",
    resentMessage: "coral coral-verifyEmail-resentMessage",
  },

  /**
   * myCommentsTabPane is the tab pane that shows viewers comments.
   */
  myCommentsTabPane: {
    $root: "coral coral-myComments",
    loadMoreButton:
      "coral coral-loadMoreButton coral-myComments-loadMoreButton",
  },

  /**
   * myComment is the comment that shows up in the viewers comment history.
   */
  myComment: {
    $root: "coral coral-myComment",
    story: "coral coral-myComment-story",
    timestamp: "coral coral-myComment-timestamp",
    content: "coral coral-myComment-content",
    replies: "coral coral-myComment-replies",
    reactions: "coral coral-myComment-reactions",
    viewConversationButton: "coral coral-myComment-viewConversationButton",
    commentOn: "coral coral-myComment-commentOn",
  },

  /**
   * notificationsTabPane is the tab pane that shows notifications settings.
   */
  notificationsTabPane: {
    $root: "coral coral-notifications",
  },

  preferencesTabPane: {
    $root: "coral coral-preferences",
  },

  /**
   * accountTabPane is the tab pane that shows account settings.
   */
  accountTabPane: {
    $root: "coral coral-account",
  },

  /**
   * ignoredCommenters is ignored commenters settings.
   */
  ignoredCommenters: {
    $root: "coral coral-ignoredCommenters",
    heading: "coral coral-ignoredCommenters-heading",
    list: "coral coral-ignoredCommenters-list",
    manageButton: "coral coral-ignoredComments-manageButton",
    username: "coral coral-ignoredCommenters-username",
    stopIgnoreButton: "coral coral-ignoredCommenters-stopIgnoreButton",
  },

  myBio: {
    $root: "coral coral-myBio",
    heading: "coral coral-myBio-heading",
  },

  /**
   * myPassword allows the viewer to change password in settings.
   */
  myPassword: {
    $root: "coral coral-myPassword",
    title: "coral coral-myPassword-title",
    editButton: "coral coral-myPassword-editButton",
    form: {
      $root: "coral coral-changePassword",
      footer: "coral coral-changePassword-footer",
      cancelButton: "coral coral-changePassword-cancelButton",
      forgotButton: "coral coral-changePassword-forgotButton",
      changeButton: "coral coral-changePassword-changeButton",
      successMessageContainer: "coral coral-changePassword-successContainer",
      successMessage: "coral coral-changePassword-successMessage",
      errorMessage: "coral coral-changePassword-errorMessage",
    },
  },

  /**
   * downloadCommentHistory allows the viewer to download the comment
   * history in settings.
   */
  downloadCommentHistory: {
    $root: "coral coral-downloadCommentHistory",
    requestButton: "coral coral-downloadCommentHistory-requestButton",
    recentRequest: "coral coral-downloadCommentHistory-recentRequest",
    requestLater: "coral coral-downloadCommentHistory-requestLater",
    requestError: "coral coral-downloadCommentHistory-requestError",
  },

  /**
   * deleteMyAccount allows the viewer to delete their account.
   */
  deleteMyAccount: {
    $root: "coral coral-deleteMyAccount",
    title: "coral coral-deleteMyAccount-title",
    section: "coral coral-deleteMyAccount-section",
    content: "coral coral-deleteMyAccount-content",
    requestButton: "coral coral-deleteMyAccount-requestButton",
    cancelRequestButton: "coral coral-deleteMyAccount-cancelRequestButton",
  },

  /**
   * pendingAccountDeletion is the message box informing the viewer
   * about a pending account deletion.
   */
  pendingAccountDeletion: {
    $root: "coral coral-pendingAccountDeletion",
    container: "coral coral-pendingAccountDeletion-container",
    cancelRequestButton:
      "coral coral-pendingAccountDeletion-cancelRequestButton",
    icon: "coral coral-pendingAccountDeletion-cancelRequestIcon",
  },

  /**
   * deleteMyAccount allows the viewer to delete their account.
   */
  deleteMyAccountModal: {
    $root: "coral coral-deleteMyAccountModal",
    header: "coral coral-deleteMyAccountModal-header",
    headerText: "coral coral-deleteMyAccountModal-headerText",
    subHeaderText: "coral coral-deleteMyAccountModal-subHeaderText",
    body: "coral coral-deleteMyAccountModal-body",
    sectionContent: "coral coral-deleteMyAccountModal-sectionContent",
    sectionHeader: "coral coral-deleteMyAccountModal-sectionHeader",
    cancelButton: "coral coral-deleteMyAccountModal-cancelButton",
    proceedButton: "coral coral-deleteMyAccountModal-proceedButton",
    doneButton: "coral coral-deleteMyAccountModal-doneButton",
    stepBar: "coral coral-deleteMyAccountModal-stepBar",
    deleteMyAccountButton: "coral coral-deleteMyAccount-deleteMyAccountButton",
  },

  /**
   * configureTabPane is the tab pane that lets priviledged users to
   * change settings of the stream.
   */
  configureTabPane: {
    $root: "coral coral-configure",
  },

  /**
   * configureMessageBox is the message box section in the stream configure.
   */
  configureMessageBox: {
    $root: "coral coral-configureMessageBox",
    messageBox: "coral coral-configureMessageBox-messageBox",
    option: "coral coral-configureMessageBox-option",
  },

  /**
   * configureCommentStream allows priviledged users to adjust settings of
   * the stream.
   */
  configureCommentStream: {
    $root: "coral coral-configureCommentStream",
    applyButton: "coral coral-configureCommentStream-applyButton",
    errorMessage: "coral coral-configureCommentStream-errorMessage",
    successMessage: "coral coral-configureCommentStream-successMessage",
  },

  /**
   * closeCommentStream allows priviledged users to close the stream.
   */
  closeCommentStream: {
    $root: "coral coral-closeCommentStream",
    closeButton: "coral coral-closeCommentStream-closeButton",
  },

  /**
   * openCommentStream allows priviledged users to open the stream.
   */
  openCommentStream: {
    $root: "coral coral-openCommentStream",
    openButton: "coral coral-openCommentStream-openButton",
  },

  emailNotifications: {
    $root: "coral coral-emailNotifications",
    heading: "coral coral-emailNotifications-heading",
    label: "coral coral-emailNotifications-label",
    updateButton: "coral coral-emailNotifications-updateButton",
  },

  mediaPreferences: {
    $root: "coral coral-mediaPreferences",
    heading: "coral coral-mediaPreferences-heading",
    updateButton: "coral coral-mediaPreferences-updateButton",
  },

  /**
   * spinner is the loading indicator.
   */
  spinner: "coral-spinner",

  /**
   * validation message that shows up on form errors.
   */
  validationMessage: "coral-validation-message",

  login: {
    signIn: {
      noAccount: "coral coral-login-signIn-noAccount",
    },
    signUp: {
      alreadyHaveAccount: "coral coral-login-signUp-alreadyHaveAccount",
    },
    signInWithEmail: {
      forgotPassword: "coral coral-login-signInWithEmail-forgotPassword",
    },
    bar: "coral coral-login-bar",
    title: "coral coral-login-title",
    header: "coral coral-login-header",
    subBar: "coral coral-login-subBar",
    orSeparator: "coral coral-login-orSeparator",
    description: "coral coral-login-description",
    field: "coral coral-login-field",
    errorContainer: "coral coral-login-errorContainer",
    error: "coral coral-login-error",
    facebookButton: "coral coral-login-facebookButton",
    googleButton: "coral coral-login-googleButton",
    oidcButton: "coral coral-login-oidcButton",
  },

  moderateStream: "coral coral-general-moderateStreamLink",

  discussions: {
    $root: "coral coral-discussions",
    mostActiveDiscussions: "coral coral-mostActiveDiscussions",
    myOngoingDiscussions: "coral coral-myOngoingDiscussions",
    header: "coral coral-discussions-header",
    subHeader: "coral coral-discussions-subHeader",
    discussionsList: "coral coral-discussions-list",
    story: {
      $root: "coral coral-discussions-story",
      header: "coral coral-discussions-story-header",
      commentsCount: "coral coral-discussions-story-commentsCount",
      commentsCountIcon: "coral coral-discussions-story-commentsCountIcon",
      date: "coral coral-discussions-story-date",
      siteName: "coral coral-discussions-story-siteName",
    },
    viewHistoryButton: "coral coral-discussions-viewHistoryButton",
  },

  ratingsAndReview: {
    noReviews: "coral coral-ratingsReview-noReviewsYet",
    ratingsFilter: "coral coral-ratingsReview-filter",
    stars: {
      rating: "coral coral-ratingsReview-rating",
      readonly: "coral coral-ratingsReview-rating-readonly",
      icon: "coral coral-ratingsReview-icon",
    },
    input: {
      title: "coral coral-ratingsReview-input-title",
    },
  },

  mobileToolbar: "coral coral-mobileToolbar",

  viewersWatching: {
    $root: "coral coral-viewersWatching",
  },

  modMessage: {
    $root: "coral coral-modMessage",
  },

  bannedInfo: {
    $root: "coral coral-bannedInfo",
  },

  accountSettings: {
    $root: "coral coral-accountSettings",
  },

  icon: "coral coral-icon",
};

export default CLASSES;
