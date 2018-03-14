const SettingsService = require('../services/settings');
const fs = require('fs');
const path = require('path');
const merge = require('lodash/merge');
const memoize = require('lodash/memoize');

const {
  BASE_URL,
  BASE_PATH,
  MOUNT_PATH,
  STATIC_URL,
  STATIC_ORIGIN,
} = require('../url');

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
    STATIC_ORIGIN,
  },
};

// attachStaticLocals will attach the locals to the response only.
const attachStaticLocals = locals => {
  for (const key in TEMPLATE_LOCALS) {
    const value = TEMPLATE_LOCALS[key];

    locals[key] = value;
  }
};

function getManifest() {
  return merge(
    {},
    ...['../dist/manifest.json', '../dist/manifest.embed.json']
      .map(f => fs.readFileSync(path.resolve(__dirname, f), 'utf8'))
      .map(JSON.parse)
  );
}

const getManifestMemoized = memoize(getManifest);

if (process.env.NODE_ENV === 'production') {
  // Crash early if file does not exists.
  getManifestMemoized();
}

function resolve(key) {
  if (process.env.NODE_ENV === 'production') {
    return `${STATIC_URL}static/${getManifestMemoized()[key]}`;
  } else {
    // In dev mode, we are more forgiving and we always load the
    // newest version of the manifest.
    try {
      return `${STATIC_URL}static/${getManifest()[key]}`;
    } catch (err) {
      console.warn(err);
      return '';
    }
  }
}

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

  res.locals.resolve = resolve;

  // Forward the request.
  next();
};

module.exports.attachStaticLocals = attachStaticLocals;
module.exports.TEMPLATE_LOCALS = TEMPLATE_LOCALS;
