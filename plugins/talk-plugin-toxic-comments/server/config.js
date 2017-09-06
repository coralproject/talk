module.exports = {
  API_ENDPOINT: 'https://commentanalyzer.googleapis.com/v1alpha1',
  API_KEY: process.env.NODE_ENV !== 'test' ? process.env.TALK_PERSPECTIVE_API_KEY : '',
  TOXICITY_THRESHOLD: process.env.TALK_TOXICITY_THRESHOLD || 0.8,
};
