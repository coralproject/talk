const Subscription = {
  commentAdded(comment) {
    return comment;
  },
  commentEdited(comment) {
    return comment;
  },
  commentAccepted(comment) {
    return comment;
  },
  commentRejected(comment) {
    return comment;
  },
  commentReset(comment) {
    return comment;
  },
  commentFlagged(comment) {
    return comment;
  },
  userBanned(user) {
    return user;
  },
  userSuspended(user) {
    return user;
  },
  usernameApproved(user) {
    return user;
  },
  usernameRejected(user) {
    return user;
  },
  usernameFlagged(user) {
    return user;
  },
  usernameChanged(payload) {
    return payload;
  },
};

module.exports = Subscription;
