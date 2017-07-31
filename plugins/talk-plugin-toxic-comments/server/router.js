const http = require('axios');
const boom = require('express-boom');
const bodyParser = require('body-parser');
var count = 0;

module.exports = (router) => {

  const key = process.env.TALK_PERSPECTIVE_API_KEY;
  if(!key) {
    throw new Error('Please set the TALK_PERSPECTIVE_API_KEY environment variable to use the toxic-comments plugin. Visit https://www.perspectiveapi.com/ to request API access.');
  }


  router.use(boom());
  router.use(bodyParser.text());

  router.get('/api/v1/toxicity', (req, res) => {
    var comment = req.query.comment;
    if(comment) {
      var body = {
        comment: {
          text: comment,
          languages: ["en"],
          requestedAttributes: {
            TOXICITY: {}
          }
        }
      };
      var headers = {
        'Content-Type': 'application/json',
      };
      http.post('https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key='+key, body)
      .then(function(response) {
        return res.json(response);
      })
      .catch(function(err) {
        console.log(err);
        return res.json(err);
      })
    }
    else {
      res.boom.notFound();
    }
  });

};
