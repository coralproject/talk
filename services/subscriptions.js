const cookieParser = require('cookie-parser')();
const authentication = require('../middleware/authentication');

// Session data does not automatically attach to websocket req objects.
// This middleware code looks for a user in the session and, if it exists,
// attaches it to the graph req.
const deserializeUser = req => {
  return new Promise((resolve, reject) => {
    // Parse the cookies (if they exist?).
    cookieParser(req, null, err => {
      if (err) {
        return reject(err);
      }

      // This uses the authentication connect middleware to establish the
      // current user.
      authentication(req, null, err => {
        if (err) {
          return reject(err);
        }

        // Resolve with the request (user removed possibly).
        return resolve(req);
      });
    });
  });
};

module.exports = {
  deserializeUser,
};
