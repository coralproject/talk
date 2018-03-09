module.exports = {
  UNSUBSCRIBE_SUBJECT: 'nunsub',

  // TODO: replace this with a config option in the plugin config when we get there..
  DISABLE_REQUIRE_EMAIL_VERIFICATIONS:
    process.env.TALK_DISABLE_REQUIRE_EMAIL_VERIFICATIONS_NOTIFICATIONS ===
    'TRUE',
};
