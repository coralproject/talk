// This file serves as the entrypoint to all configuration loaded by the
// application. All defaults are assumed here, validation should also be
// completed here.

// Setup the environment.
require('./services/env');

const uniq = require('lodash/uniq');
const ms = require('ms');
const debug = require('debug')('talk:config');

const localAddress = require('ip').address('private');

//==============================================================================
// CONFIG INITIALIZATION
//==============================================================================

const CONFIG = {
  // WEBPACK indicates when webpack is currently building.
  WEBPACK: process.env.WEBPACK === 'TRUE',

  // APOLLO_ENGINE_KEY specifies the key used to connect Talk to
  // https://engine.apollo.com/ for tracing of GraphQL requests.
  //
  // Note: Apollo Engine is a premium service, may not be free for certain
  // volumes of queries.
  APOLLO_ENGINE_KEY: process.env.APOLLO_ENGINE_KEY || null,

  // ENABLE_TRACING is true when the APOLLO_ENGINE_KEY is provided.
  ENABLE_TRACING: Boolean(process.env.APOLLO_ENGINE_KEY),

  // EMAIL_SUBJECT_PREFIX is the string before emails in the subject.
  EMAIL_SUBJECT_PREFIX: process.env.TALK_EMAIL_SUBJECT_PREFIX || '[Talk]',

  // DEFAULT_LANG is the default language used for server sent emails and
  // rendered text.
  DEFAULT_LANG: process.env.TALK_DEFAULT_LANG || 'en',

  // When TRUE, it ensures that database indexes created in core will not add
  // indexes.
  CREATE_MONGO_INDEXES: process.env.DISABLE_CREATE_MONGO_INDEXES !== 'TRUE',

  // SETTINGS_CACHE_TIME is the time that we'll cache the settings in redis before
  // fetching again.
  SETTINGS_CACHE_TIME: ms(process.env.TALK_SETTINGS_CACHE_TIME || '1hr'),

  //------------------------------------------------------------------------------
  // JWT based configuration
  //------------------------------------------------------------------------------

  // JWT_SECRET is the secret used to sign and verify tokens issued by this
  // application.
  JWT_SECRET: process.env.TALK_JWT_SECRET || null,

  // JWT_SECRETS is used when key rotation is available.
  JWT_SECRETS: process.env.TALK_JWT_SECRETS || null,

  // JWT_COOKIE_NAME is the name of the cookie optionally containing the JWT
  // token.
  JWT_COOKIE_NAME: process.env.TALK_JWT_COOKIE_NAME || 'authorization',

  // JWT_SIGNING_COOKIE_NAME will be the cookie set when cookies are issued.
  // This defaults to the TALK_JWT_COOKIE_NAME value.
  JWT_SIGNING_COOKIE_NAME:
    process.env.TALK_JWT_SIGNING_COOKIE_NAME ||
    process.env.TALK_JWT_COOKIE_NAME ||
    'authorization',

  // JWT_COOKIE_NAMES declares the many cookie names used for verification.
  JWT_COOKIE_NAMES: process.env.TALK_JWT_COOKIE_NAMES || null,

  // JWT_CLEAR_COOKIE_LOGOUT specifies whether the named cookie should be
  // cleared when the user is logged out.
  JWT_CLEAR_COOKIE_LOGOUT: process.env.TALK_JWT_CLEAR_COOKIE_LOGOUT
    ? process.env.TALK_JWT_CLEAR_COOKIE_LOGOUT !== 'FALSE'
    : true,

  // JWT_DISABLE_AUDIENCE when TRUE will disable the audience claim (aud) from tokens.
  JWT_DISABLE_AUDIENCE: process.env.TALK_JWT_DISABLE_AUDIENCE === 'TRUE',

  // JWT_AUDIENCE is the value for the audience claim for the tokens that will be
  // verified when decoding. If `JWT_AUDIENCE` is not in the environment, then it
  // will default to `talk`.
  JWT_AUDIENCE: process.env.TALK_JWT_AUDIENCE || 'talk',

  // JWT_DISABLE_ISSUER when TRUE will disable the issuer claim (iss) from tokens.
  JWT_DISABLE_ISSUER: process.env.TALK_JWT_DISABLE_ISSUER === 'TRUE',

  // JWT_USER_ID_CLAIM is the claim which stores the user's id. This may be a deep
  // object delimited using dot notation. Example `user.id` would store it like:
  // {user: {id}} on the claims object. (Default `sub`)
  JWT_USER_ID_CLAIM: process.env.TALK_JWT_USER_ID_CLAIM || 'sub',

  // JWT_ISSUER is the value for the issuer for the tokens that will be verified
  // when decoding. If `JWT_ISSUER` is not in the environment, then it will try
  // `TALK_ROOT_URL`, otherwise, it will be undefined.
  JWT_ISSUER: process.env.TALK_JWT_ISSUER || process.env.TALK_ROOT_URL,

  // JWT_EXPIRY is the time for which a given token is valid for.
  JWT_EXPIRY: process.env.TALK_JWT_EXPIRY || '1 day',

  // JWT_ALG is the algorithm used for signing jwt tokens.
  JWT_ALG: process.env.TALK_JWT_ALG || 'HS256',

  //------------------------------------------------------------------------------
  // Installation locks
  //------------------------------------------------------------------------------

  INSTALL_LOCK: process.env.TALK_INSTALL_LOCK === 'TRUE',

  //------------------------------------------------------------------------------
  // Middleware Configuration
  //------------------------------------------------------------------------------

  // HELMET_CONFIGURATION provides the entrypoint to override options for the
  // helmet middleware used.
  HELMET_CONFIGURATION: JSON.parse(
    process.env.TALK_HELMET_CONFIGURATION || '{}'
  ),

  //------------------------------------------------------------------------------
  // External database url's
  //------------------------------------------------------------------------------

  MONGO_URL: process.env.TALK_MONGO_URL,
  REDIS_URL: process.env.TALK_REDIS_URL,

  // REDIS_CLIENT_CONFIG is the optional configuration that is merged with the
  // function config to provide deep control of the redis connection beheviour.
  REDIS_CLIENT_CONFIG: process.env.TALK_REDIS_CLIENT_CONFIGURATION || '{}',

  // REDIS_CLUSTER_MODE allows configuration on the type of cluster mode enabled
  // on the redis client. Can be either `NONE` or `CLUSTER`.
  REDIS_CLUSTER_MODE: process.env.TALK_REDIS_CLUSTER_MODE || 'NONE',

  // REDIS_CLUSTER_CONFIGURATION contains the json string for the redis cluster
  // configuration.
  REDIS_CLUSTER_CONFIGURATION:
    process.env.TALK_REDIS_CLUSTER_CONFIGURATION || '[]',

  // REDIS_RECONNECTION_BACKOFF_FACTOR is the factor that will be multiplied
  // against the current attempt count inbetween attempts to connect to redis.
  REDIS_RECONNECTION_BACKOFF_FACTOR: ms(
    process.env.TALK_REDIS_RECONNECTION_BACKOFF_FACTOR || '500 ms'
  ),

  // REDIS_RECONNECTION_BACKOFF_MINIMUM_TIME is the minimum time used to delay
  // before attempting to reconnect to redis.
  REDIS_RECONNECTION_BACKOFF_MINIMUM_TIME: ms(
    process.env.TALK_REDIS_RECONNECTION_BACKOFF_MINIMUM_TIME || '1 sec'
  ),

  //------------------------------------------------------------------------------
  // Server Config
  //------------------------------------------------------------------------------

  // Port to bind to.
  PORT:
    process.env.TALK_PORT ||
    process.env.PORT ||
    (process.env.NODE_ENV === 'test' ? '3001' : '3000'),

  // The URL for this Talk Instance as viewable from the outside.
  ROOT_URL: process.env.TALK_ROOT_URL || null,

  // ROOT_URL_MOUNT_PATH when TRUE will extract the pathname from the
  // TALK_ROOT_URL and use it to mount the paths on.
  ROOT_URL_MOUNT_PATH: process.env.TALK_ROOT_URL_MOUNT_PATH === 'TRUE',

  // DISABLE_STATIC_SERVER when TRUE will disable the routes used for static
  // asset serving.
  DISABLE_STATIC_SERVER: process.env.TALK_DISABLE_STATIC_SERVER === 'TRUE',

  // STATIC_URI is the base uri where static files are hosted.
  STATIC_URI: process.env.TALK_STATIC_URI || process.env.TALK_ROOT_URL,

  // The keepalive timeout (in ms) that should be used to send keep alive
  // messages through the websocket to keep the socket alive.
  KEEP_ALIVE: process.env.TALK_KEEP_ALIVE || '30s',

  //------------------------------------------------------------------------------
  // Cache configuration
  //------------------------------------------------------------------------------

  CACHE_EXPIRY_COMMENT_COUNT:
    process.env.TALK_CACHE_EXPIRY_COMMENT_COUNT || '1hr',

  //------------------------------------------------------------------------------
  // Recaptcha configuration
  //------------------------------------------------------------------------------

  RECAPTCHA_ENABLED: false, // updated below
  RECAPTCHA_PUBLIC: process.env.TALK_RECAPTCHA_PUBLIC,
  RECAPTCHA_SECRET: process.env.TALK_RECAPTCHA_SECRET,

  // WEBSOCKET_LIVE_URI is the absolute url to the live endpoint.
  WEBSOCKET_LIVE_URI: process.env.TALK_WEBSOCKET_LIVE_URI || null,

  //------------------------------------------------------------------------------
  // SMTP Server configuration
  //------------------------------------------------------------------------------

  SMTP_HOST: process.env.TALK_SMTP_HOST,
  SMTP_USERNAME: process.env.TALK_SMTP_USERNAME,
  SMTP_PORT: process.env.TALK_SMTP_PORT,
  SMTP_PASSWORD: process.env.TALK_SMTP_PASSWORD,
  SMTP_FROM_ADDRESS: process.env.TALK_SMTP_FROM_ADDRESS,

  //------------------------------------------------------------------------------
  // Flagging Config
  //------------------------------------------------------------------------------

  // DISABLE_AUTOFLAG_SUSPECT_WORDS is true when the suspect words that are
  // matched should not be flagged.
  DISABLE_AUTOFLAG_SUSPECT_WORDS:
    process.env.TALK_DISABLE_AUTOFLAG_SUSPECT_WORDS === 'TRUE',

  // TRUST_THRESHOLDS defines the thresholds used for automoderation.
  TRUST_THRESHOLDS: process.env.TRUST_THRESHOLDS || 'comment:2,-1;flag:2,-1',

  // IGNORE_FLAGS_AGAINST_STAFF disables staff members from entering the
  // reported queue from comments after this was enabled and from reports
  // against the staff members user account.
  IGNORE_FLAGS_AGAINST_STAFF:
    process.env.TALK_DISABLE_IGNORE_FLAGS_AGAINST_STAFF !== 'TRUE',
};

//==============================================================================
// CONFIG VALIDATION
//==============================================================================

if (process.env.NODE_ENV === 'test') {
  if (!CONFIG.ROOT_URL) {
    CONFIG.ROOT_URL = `http://${localAddress}:3001`;
  }
  if (!CONFIG.STATIC_URL) {
    CONFIG.STATIC_URI = `http://${localAddress}:3001`;
  }
} else if (!CONFIG.ROOT_URL) {
  throw new Error('TALK_ROOT_URL must be provided');
}

//------------------------------------------------------------------------------
// JWT based configuration
//------------------------------------------------------------------------------

if (CONFIG.JWT_SECRETS) {
  CONFIG.JWT_SECRETS = JSON.parse(CONFIG.JWT_SECRETS);
} else if (!CONFIG.JWT_SECRET) {
  if (process.env.NODE_ENV === 'test') {
    if (!CONFIG.JWT_ALG.startsWith('HS')) {
      throw new Error(
        'Providing a asymmetric signing/verfying algorithm without a corresponding secret is not permitted'
      );
    }

    CONFIG.JWT_SECRET = 'keyboard cat';
  } else {
    throw new Error(
      'TALK_JWT_SECRET must be provided in the environment to sign/verify tokens'
    );
  }
}

// Disable the audience claim if requested.
if (CONFIG.JWT_DISABLE_AUDIENCE) {
  CONFIG.JWT_AUDIENCE = undefined;
}

// Disable the issuer claim if requested.
if (CONFIG.JWT_DISABLE_ISSUER) {
  CONFIG.JWT_ISSUER = undefined;
}

// Parse and handle cookie names.
if (CONFIG.JWT_COOKIE_NAMES) {
  CONFIG.JWT_COOKIE_NAMES = CONFIG.JWT_COOKIE_NAMES.split(',');
} else {
  CONFIG.JWT_COOKIE_NAMES = [];
}

// Add in the default cookie names and strip duplicates.
CONFIG.JWT_COOKIE_NAMES = uniq(
  CONFIG.JWT_COOKIE_NAMES.concat([
    CONFIG.JWT_COOKIE_NAME,
    CONFIG.JWT_SIGNING_COOKIE_NAME,
  ])
);

//------------------------------------------------------------------------------
// External database url's
//------------------------------------------------------------------------------

// Reset the mongo url in the event it hasn't been overridden and we are in a
// testing environment. Every new mongo instance comes with a test database by
// default, this is consistent with common testing and use case practices.
if (process.env.NODE_ENV === 'test' && !CONFIG.MONGO_URL) {
  CONFIG.MONGO_URL = 'mongodb://localhost/test';
}

// Reset the redis url in the event it hasn't been overridden and we are in a
// testing environment.
if (process.env.NODE_ENV === 'test' && !CONFIG.REDIS_URL) {
  CONFIG.REDIS_URL = 'redis://localhost/1';
}

// REDIS_CLUSTER_CONFIGURATION should be parsed when the cluster mode !== none.
if (CONFIG.REDIS_CLUSTER_MODE === 'CLUSTER') {
  try {
    CONFIG.REDIS_CLUSTER_CONFIGURATION = JSON.parse(
      CONFIG.REDIS_CLUSTER_CONFIGURATION
    );
  } catch (err) {
    throw new Error(
      'TALK_REDIS_CLUSTER_CONFIGURATION is not valid JSON, see https://github.com/luin/ioredis#cluster for valid syntax of the list of cluster nodes'
    );
  }

  if (!Array.isArray(CONFIG.REDIS_CLUSTER_CONFIGURATION)) {
    throw new Error(
      'TALK_REDIS_CLUSTER_MODE is CLUSTER, but the TALK_REDIS_CLUSTER_CONFIGURATION is invalid, see https://github.com/luin/ioredis#cluster for valid syntax of the list of cluster nodes'
    );
  }

  if (CONFIG.REDIS_CLUSTER_CONFIGURATION.length === 0) {
    throw new Error(
      'TALK_REDIS_CLUSTER_CONFIGURATION must have at least one node specified in the cluster, see https://github.com/luin/ioredis#cluster for valid syntax of the list of cluster nodes'
    );
  }
}

// Client config is a JSON encoded string, defaulting to `{}`.
CONFIG.REDIS_CLIENT_CONFIG = JSON.parse(CONFIG.REDIS_CLIENT_CONFIG);

//------------------------------------------------------------------------------
// Recaptcha configuration
//------------------------------------------------------------------------------

/**
 * This is true when the recaptcha secret is provided and the Recaptcha feature
 * is to be enabled.
 */
CONFIG.RECAPTCHA_ENABLED = CONFIG.RECAPTCHA_SECRET && CONFIG.RECAPTCHA_PUBLIC;

debug(
  `reCAPTCHA is ${
    CONFIG.RECAPTCHA_ENABLED
      ? 'enabled'
      : 'disabled, required config is not present'
  }`
);

module.exports = CONFIG;
