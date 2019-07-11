import convict from "convict";
import Joi from "joi";
import { parseConnectionString } from "mongodb-core";
import os from "os";

import { LOCALES } from "coral-common/helpers/i18n/locales";
import { ensureEndSlash } from "coral-common/utils";

import { InternalError } from "./errors";

// Add custom format for the mongo uri scheme.
convict.addFormat({
  name: "mongo-uri",
  validate: (url: string) => {
    parseConnectionString(url, err => {
      if (err) {
        throw new InternalError(err, "invalid mongo-uri");
      }
    });
  },
});

// Add custom format for the redis uri scheme.
convict.addFormat({
  name: "redis-uri",
  validate: (url: string) => {
    Joi.assert(
      url,
      Joi.string().uri({
        scheme: ["redis"],
      })
    );
  },
});

// Add a custom format for the optional-url that includes a trailing slash.
convict.addFormat({
  name: "optional-url",
  validate: (url: string) => {
    if (url) {
      Joi.assert(url, Joi.string().uri());
    }
  },
  // Ensure that there is an ending slash.
  coerce: (url: string) => (url ? ensureEndSlash(url) : url),
});

const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  default_locale: {
    doc:
      "Specify the default locale to use for all requests without a locale specified",
    format: LOCALES,
    default: "en-US",
    env: "LOCALE",
  },
  enable_graphiql: {
    doc: "When true, this will enable the GraphiQL interface at /graphiql",
    format: Boolean,
    default: false,
    env: "ENABLE_GRAPHIQL",
    arg: "enableGraphiQL",
  },
  concurrency: {
    doc: "The number of worker nodes to spawn to handle traffic",
    format: Number,
    default: os.cpus().length,
    env: "CONCURRENCY",
    arg: "concurrency",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 3000,
    env: "PORT",
    arg: "port",
  },
  cluster_metrics_port: {
    doc: "The port to bind for cluster metrics.",
    format: "port",
    default: 3001,
    env: "CLUSTER_METRICS_PORT",
    arg: "clusterMetricsPort",
  },
  metrics_username: {
    doc: "The username to use to authenticate to the metrics endpoint.",
    format: "String",
    default: "",
    env: "METRICS_USERNAME",
    arg: "metricsUsername",
  },
  metrics_password: {
    doc: "The password to use to authenticate to the metrics endpoint.",
    format: "String",
    default: "",
    env: "METRICS_PASSWORD",
    arg: "metricsPassword",
    sensitive: true,
  },
  dev_port: {
    doc: "The port to bind for the Webpack Dev Server.",
    format: "port",
    default: 8080,
    env: "DEV_PORT",
    arg: "dev-port",
  },
  mongodb: {
    doc: "The MongoDB database to connect to.",
    format: "mongo-uri",
    default: "mongodb://127.0.0.1:27017/coral",
    env: "MONGODB_URI",
    arg: "mongodb",
    sensitive: true,
  },
  redis: {
    doc: "The Redis database to connect to.",
    format: "redis-uri",
    default: "redis://127.0.0.1:6379",
    env: "REDIS_URI",
    arg: "redis",
    sensitive: true,
  },
  redis_options: {
    doc: "The Redis options to connect to Redis Server.",
    format: Object,
    default: {},
    env: "REDIS_OPTIONS",
    arg: "redisOptions",
  },
  signing_secret: {
    doc:
      "The shared secret to use to sign JSON Web Tokens (JWT) with the selected signing algorithm.",
    format: "*",
    default: "keyboard cat", // TODO: (wyattjoh) evaluate best solution
    env: "SIGNING_SECRET",
    arg: "signingSecret",
    sensitive: true,
  },
  signing_algorithm: {
    doc: "",
    format: [
      "HS256",
      "HS384",
      "HS512",
      "RS256",
      "RS384",
      "RS512",
      "ES256",
      "ES384",
      "ES512",
    ],
    default: "HS256",
    env: "SIGNING_ALGORITHM",
    arg: "signingAlgorithm",
  },
  logging_level: {
    doc: "The logging level to print to the console",
    format: ["fatal", "error", "warn", "info", "debug", "trace"],
    default: "info",
    env: "LOGGING_LEVEL",
    arg: "logging",
  },
  static_uri: {
    doc: "The URL that static assets will be hosted from",
    format: "optional-url",
    default: "",
    env: "STATIC_URI",
    arg: "staticUri",
  },
  websocket_keep_alive_timeout: {
    doc:
      "The keepalive timeout (in ms) that should be used to send keep alive messages through the websocket to keep the socket alive",
    format: "duration",
    default: "30 seconds",
    env: "WEBSOCKET_KEEP_ALIVE_TIMEOUT",
    arg: "websocketKeepAliveTimeout",
  },
  disable_tenant_caching: {
    doc:
      "Disables the tenant caching, all tenants will be loaded from MongoDB each time it's needed",
    format: Boolean,
    default: false,
    env: "DISABLE_TENANT_CACHING",
    arg: "disableTenantCaching",
  },
  disable_live_updates: {
    doc:
      "Disables subscriptions for the comment stream for all stories across all tenants",
    format: Boolean,
    default: false,
    env: "DISABLE_LIVE_UPDATES",
    arg: "disableLiveUpdates",
  },
  disable_mongodb_autoindexing: {
    doc: "Disables the creation of new MongoDB indexes",
    format: Boolean,
    default: false,
    env: "DISABLE_MONGODB_AUTOINDEXING",
    arg: "disableMongoDBAutoindexing",
  },
  disable_client_routes: {
    doc:
      "Disables mounting of client routes for developing with Webpack Dev Server",
    format: Boolean,
    default: false,
    env: "DISABLE_CLIENT_ROUTES",
    arg: "disableClientRoutes",
  },
  disable_rate_limiters: {
    doc:
      "Disables the rate limiters in development. This will only work when also set to a development environment",
    format: Boolean,
    default: false,
    env: "DISABLE_RATE_LIMITERS",
    arg: "disableRateLimiters",
  },
});

export type Config = typeof config;

// Setup the base configuration.
export default config;
