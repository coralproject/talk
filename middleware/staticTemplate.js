const SettingsService = require('../services/settings');

const { BASE_URL, BASE_PATH, MOUNT_PATH, STATIC_URL } = require('../url');

const { RECAPTCHA_PUBLIC, WEBSOCKET_LIVE_URI } = require('../config');

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

// attachStaticLocals will attach the locals to the response only.
const attachStaticLocals = locals => {
  for (const key in TEMPLATE_LOCALS) {
    const value = TEMPLATE_LOCALS[key];

    locals[key] = value;
  }
};

module.exports = async (req, res, next) => {
  try {
    // Attach the custom css url.
    const { customCssUrl } = await SettingsService.retrieve('customCssUrl');
    res.locals.customCssUrl = customCssUrl;
  } catch (err) {
    console.warn(err);
  }

  // Always attach the locals.
  attachStaticLocals(res.locals);

  // Forward the request.
  next();
};

module.exports.attachStaticLocals = attachStaticLocals;
module.exports.TEMPLATE_LOCALS = TEMPLATE_LOCALS;
