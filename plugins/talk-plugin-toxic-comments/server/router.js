const perspective = require('./perspective');
const {ErrNoComment} = require('./errors');

module.exports = (router) => {

  /**
   * POST /api/v1/toxicity/score
   * args:
   *  - provide the comment in the request body
   */
  router.post('/api/v1/toxicity/score', async (req, res, next) => {
    const apiKey = process.env.TALK_PERSPECTIVE_API_KEY;
    if(!apiKey) {
      throw new Error('Please set the TALK_PERSPECTIVE_API_KEY environment variable to use the toxic-comments plugin. Visit https://www.perspectiveapi.com/ to request API access.');
    }

    const {comment} = req.body;

    if(!comment) {
      return next(ErrNoComment);
    }

    try {
      const scores = await perspective.getScores(apiKey, comment);
      return res.json({
        comment,
        score: scores.SEVERE_TOXICITY.summaryScore,
      });
    } catch(err) {
      return next(err);
    }
  });

};
