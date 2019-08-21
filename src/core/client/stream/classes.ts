const CLASSES = {
  /**
   * guidlines represents the box containing the guidlines.
   */
  guidelines: "coral coral-guidelines",

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
   * rte represents the rich-text-editor
   */
  rte: {
    $root: "coral coral-rte",
    content: "coral coral-rte-content",
    placeholder: "coral coral-rte-placholder",
    toolbar: "coral coral-rte-toolbar",
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

    /**
     * configure is the button for the "Configure" tab.
     */
    configure: "coral coral-tabBar-tab coral-tabBar-configure",
  },

  /**
   * tabBarComments is all the components in the comments secondary tab bar selector.
   */
  tabBarComments: {
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
     * featuredTooltip is the tooltip next to the fextured tab.
     */
    featuredTooltip: "coral coral-tabBarComments-featuredTooltip",
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
     * username is the text display for any given Username in the system.
     */
    username: "coral coral-comment-username",

    /**
     * timestamp is the text that contains the time since the comment was
     * published.
     */
    timestamp: "coral coral-comment-timestamp",

    /**
     * userTag can be used to target a tag associated with a User.
     */
    userTag: "coral coral-comment-userTag",

    /**
     * userBadge can be used to target a badge associated with a User.
     */
    userBadge: "coral coral-comment-userBadge",

    /**
     * commentTag can be used to target a tag associated with a Comment.
     */
    commentTag: "coral coral-comment-commentTag",

    /**
     * inReplyTo shows the author of the parent comment.
     */
    inReplyTo: "coral coral-comment-inReplyTo",
  },
};

export default CLASSES;
