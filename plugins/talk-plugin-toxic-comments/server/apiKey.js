const apiKey = process.env.TALK_PERSPECTIVE_API_KEY;
if(!apiKey) {
  throw new Error('Please set the TALK_PERSPECTIVE_API_KEY environment variable to use the toxic-comments plugin. Visit https://www.perspectiveapi.com/ to request API access.');
}

module.exports = apiKey;
