const CLASSES = {
  /**
   * tabBar is all the components in the top tab bar selector.
   */
  tabBar: {
    /**
     * $root represents the container for the tab buttons.
     */
    $root: "coral coral-tabBar",

    /**
     * allComments is the button for the "All Comments" tab.
     */
    allComments: "coral coral-tabBar-allComments",

    /**
     * myProfile is the button for the "My Profile" tab.
     */
    myProfile: "coral coral-tabBar-myProfile",

    /**
     * configure is the button for the "Configure" tab.
     */
    configure: "coral coral-tabBar-configure",
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
     * box is the actual commenting input box for creating a new comment.
     */
    box: "coral coral-createComment-box",

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
     * box is the actual commenting input box for creating a new reply.
     */
    box: "coral coral-createReplyComment-box",

    /**
     * submit is the button for submitting a new reply.
     */
    submit: "coral coral-createReplyComment-submit",
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
  },
};

export default CLASSES;
