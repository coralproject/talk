const pubsub = require('../services/pubsub');
const pubsubClient = pubsub.createClientFactory();

// To handle dependancy injection safer, we inject the pubsub handle onto the
// request object.
module.exports = (req, res, next) => {

  // Attach the pubsub handle to the requests.
  req.pubsub = pubsubClient();

  // Forward on the request.
  next();
};
