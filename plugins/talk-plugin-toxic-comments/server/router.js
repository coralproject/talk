const http = require('axios');
const boom = require('express-boom');
const bodyParser = require('body-parser');
var count = 0;

module.exports = (router) => {
  router.use(boom());
  router.use(bodyParser.text());
  router.post('/api/v1/toxicity/comments', (req, res) => {
    console.log(req.body);
    if(req.body) {
      var body = {
        comment: {
          text: req.body,
          languages: ["en"],
          requestedAttributes: {
            TOXICITY: {}
          }
        }
      };
      var headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      };
      http.post('https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key='+process.env.PERSPECTIVE_API_KEY, {
        headers: headers,
        body: body
      })
      .then(function(response) {
        return res.json(response);
      })
      .catch(function(err) {
        return res.json(err);
      })
    }
    else {
      res.boom.notFound();
    }
  });
};
