module.exports = [
  // UNSET is used when the username can be changed, and does not necessarily
  // require moderator action to become active. This can be used when the user
  // signs up with a social login and has the option of setting their own
  // username.
  'UNSET',

  // SET is used when the username has been set for the first time, but cannot
  // change without the username being rejected by a moderator and that moderator
  // agreeing that the username should be allowed to change.
  'SET',

  // APPROVED is used when the username was changed, and subsequently approved by
  // said moderator.
  'APPROVED',

  // REJECTED is used when the username was changed, and subsequently rejected by
  // said moderator.
  'REJECTED',

  // CHANGED is used after a user has changed their username after it was
  // rejected.
  'CHANGED',
];
