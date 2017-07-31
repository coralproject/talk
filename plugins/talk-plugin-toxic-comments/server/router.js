const http = require('axios');
const boom = require('express-boom');
const bodyParser = require('body-parser');

module.exports = (router) => {

  const key = process.env.TALK_PERSPECTIVE_API_KEY;
  if(!key) {
    throw new Error('Please set the TALK_PERSPECTIVE_API_KEY environment variable to use the toxic-comments plugin. Visit https://www.perspectiveapi.com/ to request API access.');
  }


  router.use(boom());
  router.use(bodyParser.text());

  /**
   * POST /api/v1/toxicity/score
   * args:
   *  - provide the comment in the request body
   */
  router.post('/api/v1/toxicity/score', (req, res) => {
    var comment = req.body;
    if(comment) {
      var body = {
        comment: {
          text: comment,
        },
        languages: ["en"],
        requestedAttributes: {
          TOXICITY: {}
        }
      };
      var headers = {
        'Content-Type': 'application/json',
      };
      http.post(
        'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key='+key,
        body)
      .then(function(response) {
        var data = response.data;
        var score = {
          comment: comment,
          score: data.attributeScores.TOXICITY.summaryScore.value
        }
        return res.json(score);
      })
      .catch(function(err) {
        console.log(err);
        res.boom.badRequest('The Perspective API returned an error. Please check the server logs for details.');
      })
    }
    else {
      res.boom.badRequest('No comment provided');
    }
  });

};
