module.exports = {
  typeDefs: `
      enum DIGEST_FREQUENCY {
        # HOURLY will queue up the notifications and send them hourly.
        HOURLY
      }
    `,
  notificationDigests: {
    HOURLY: { cronTime: '0 * * * *', timeZone: 'America/New_York' },
  },
};
