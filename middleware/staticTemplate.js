const {
  BASE_URL,
  BASE_PATH,
  MOUNT_PATH,
  STATIC_URL,
} = require('../url');

const {
  RECAPTCHA_PUBLIC,
  WEBSOCKET_LIVE_URI,
} = require('../config');

// TEMPLATE_LOCALS stores the static data that is provided as a `text/json` on
// to the client from the template.
const TEMPLATE_LOCALS = {
  BASE_URL,
  BASE_PATH,
  MOUNT_PATH,
  STATIC_URL,
  data: {
    TALK_RECAPTCHA_PUBLIC: RECAPTCHA_PUBLIC,
    LIVE_URI: WEBSOCKET_LIVE_URI,
    STATIC_URL,
  },
};

// attachLocals will attach the locals to the response only.
const attachLocals = (locals) => {
  for (const key in TEMPLATE_LOCALS) {
    const value = TEMPLATE_LOCALS[key];

    locals[key] = value;
  }
};

module.exports = (req, res, next) => {

  // Always attach the locals.
  attachLocals(res.locals);

  // Forward the request.
  next();
};

module.exports.attachLocals = attachLocals;
