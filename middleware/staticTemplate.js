const SettingsService = require('../services/settings');
const fs = require('fs');
const path = require('path');
const { merge } = require('lodash');

const {
  BASE_URL,
  BASE_ORIGIN,
  BASE_PATH,
  MOUNT_PATH,
  STATIC_URL,
  STATIC_ORIGIN,
} = require('../url');

const { RECAPTCHA_PUBLIC, WEBSOCKET_LIVE_URI } = require('../config');

// Grab TALK_CLIENT_* environment variables.
const TALK_CLIENT = /^TALK_CLIENT_/i;

// TALK_CLIENT_ENV is all the environment keys that are loaded at runtime.
const TALK_CLIENT_ENV = Object.keys(process.env)
  .filter(key => TALK_CLIENT.test(key))
  .reduce(
    (env, key) => {
      env[key] = process.env[key];
      return env;
    },
    {
      TALK_RECAPTCHA_PUBLIC: RECAPTCHA_PUBLIC,
      LIVE_URI: WEBSOCKET_LIVE_URI,
      STATIC_URL,
      STATIC_ORIGIN,
      BASE_ORIGIN,
    }
  );

// TEMPLATE_LOCALS stores the static data that is provided as a `text/json` on
// to the client from the template.
const TEMPLATE_LOCALS = {
  BASE_URL,
  BASE_PATH,
  MOUNT_PATH,
  STATIC_URL,
  TALK_CLIENT_ENV,
  data: TALK_CLIENT_ENV,
};

// attachStaticLocals will attach the locals to the response only.
const attachStaticLocals = locals => {
  for (const key in TEMPLATE_LOCALS) {
    const value = TEMPLATE_LOCALS[key];

    merge(locals, { [key]: value });
  }
};

// MANIFESTS are all the manifests accessible by Talk.
const MANIFESTS = ['../dist/manifest.json', '../dist/manifest.embed.json'];

// getManifest will retrieve the manifest files and parse the JSON.
function getManifest() {
  return merge(
    {},
    ...MANIFESTS.map(f =>
      fs.readFileSync(path.resolve(__dirname, f), 'utf8')
    ).map(JSON.parse)
  );
}

/**
 * resolveFactory is a function that can be used in templates to resolve an
 * asset from the manifest. In production, the manifest is cached.
 */
const createResolveFactory = (() => {
  if (process.env.NODE_ENV === 'production') {
    // In production, we should attempt to load the manifest early.
    const manifest = getManifest();

    return () => key => `${STATIC_URL}static/${manifest[key]}`;
  }

  // In dev mode, we are more forgiving and we always load the
  // newest version of the manifest.
  return () => {
    let manifest = {};
    try {
      manifest = getManifest();
    } catch (err) {
      console.warn(err);
    }

    return key =>
      key in manifest ? `${STATIC_URL}static/${manifest[key]}` : '';
  };
})();

module.exports = async (req, res, next) => {
  try {
    // Attach the custom css url and organization name.
    const { customCssUrl, organizationName } = await SettingsService.select(
      'customCssUrl',
      'organizationName'
    );
    res.locals.customCssUrl = customCssUrl;
    res.locals.organizationName = organizationName;
  } catch (err) {
    console.warn(err);
  }

  // Always attach the locals.
  attachStaticLocals(res.locals);

  // Resolve will help resolving paths to static files
  // using the manifest.
  res.locals.resolve = createResolveFactory();

  // Forward the request.
  next();
};

module.exports.attachStaticLocals = attachStaticLocals;
module.exports.TEMPLATE_LOCALS = TEMPLATE_LOCALS;
