const config = {
  SLACK_WEBHOOK_URL: process.env.TALK_SLACK_WEBHOOK_URL,
  SLACK_WEBHOOK_TIMEOUT: process.env.TALK_SLACK_WEBHOOK_TIMEOUT || 5000,
};

if (process.env.NODE_ENV !== 'test' && !config.SLACK_WEBHOOK_URL) {
  // TODO this error should point users to Talk's Slack app once that's in place
  throw new Error(
    'Please set the TALK_SLACK_WEBHOOK_URL environment variable to use the slack-notifications plugin.'
  );
}

module.exports = config;
