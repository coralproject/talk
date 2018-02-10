const Subscription = {};

// All of the subscription endpoints need to have an object to serialize when
// pushing out via PubSub, this simply ensures that all these entries will
// return the root object from the subscription to the PubSub framework.
[
  'commentAdded',
  'commentEdited',
  'commentAccepted',
  'commentRejected',
  'commentReset',
  'commentFlagged',
  'userBanned',
  'userSuspended',
  'usernameApproved',
  'usernameRejected',
  'usernameFlagged',
  'usernameChanged',
].forEach(field => {
  Subscription[field] = obj => obj;
});

module.exports = Subscription;
