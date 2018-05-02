const config = {
  KEY: process.env.TALK_AKISMET_API_KEY,
  SITE: process.env.TALK_AKISMET_SITE,
};

if (process.env.NODE_ENV !== 'test' && (!config.KEY || !config.SITE)) {
  throw new Error(
    'Please set the TALK_AKISMET_API_KEY and TALK_AKISMET_SITE environment variable to use talk-plugin-akismet-comments. Visit https://akismet.com/ to get started.'
  );
}

module.exports = config;
