module.exports = {
  typeDefs: `
    enum DIGEST_FREQUENCY {
      # DAILY will queue up the notifications and send them daily.
      DAILY
    }
  `,
  notificationDigests: {
    DAILY: { cronTime: '0 0 * * *', timeZone: 'America/New_York' },
  },
};
