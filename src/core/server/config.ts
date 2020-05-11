import Joi from "@hapi/joi";
import convict from "convict";
import { parseConnectionString } from "mongodb-core";
import ms from "ms";
import os from "os";

import { LOCALES } from "coral-common/helpers/i18n/locales";
import { ensureEndSlash } from "coral-common/utils";

import { InternalError } from "./errors";

// Add custom format for the mongo uri scheme.
convict.addFormat({
  name: "mongo-uri",
  validate: (url: string) => {
    parseConnectionString(url, (err) => {
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

// Add a custom format that is a duration parsed with `ms` to used instead of
// the default format which will use `moment`.
convict.addFormat({
  name: "ms",
  validate: (val: number) => {
    Joi.assert(val, Joi.number().positive().integer().required());
  },
  coerce: (val: string): number => ms(val),
});

const algorithms = [
  "HS256",
  "HS384",
  "HS512",
  "RS256",
  "RS384",
  "RS512",
  "ES256",
  "ES384",
  "ES512",
];

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
  trust_proxy: {
    doc:
      'When provided, it configures the "trust proxy" settings for Express (See https://expressjs.com/en/guide/behind-proxies.html)',
    format: String,
    default: "",
    env: "TRUST_PROXY",
  },
  enable_graphiql: {
    doc: "When true, this will enable the GraphiQL interface at /graphiql",
    format: Boolean,
    default: false,
    env: "ENABLE_GRAPHIQL",
  },
  concurrency: {
    doc: "The number of worker nodes to spawn to handle traffic",
    format: Number,
    default: os.cpus().length,
    env: "CONCURRENCY",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 3000,
    env: "PORT",
  },
  metrics_username: {
    doc: "The username to use to authenticate to the metrics endpoint.",
    format: "String",
    default: "",
    env: "METRICS_USERNAME",
  },
  metrics_password: {
    doc: "The password to use to authenticate to the metrics endpoint.",
    format: "String",
    default: "",
    env: "METRICS_PASSWORD",
    sensitive: true,
  },
  metrics_port: {
    doc: "The port that the metrics handler should be mounted.",
    format: "port",
    default: 9000,
    env: "METRICS_PORT",
  },
  dev_port: {
    doc: "The port to bind for the Webpack Dev Server.",
    format: "port",
    default: 8080,
    env: "DEV_PORT",
  },
  mongodb: {
    doc: "The MongoDB database to connect to.",
    format: "mongo-uri",
    default: "mongodb://127.0.0.1:27017/coral",
    env: "MONGODB_URI",

    sensitive: true,
  },
  redis: {
    doc: "The Redis database to connect to.",
    format: "redis-uri",
    default: "redis://127.0.0.1:6379",
    env: "REDIS_URI",

    sensitive: true,
  },
  redis_options: {
    doc: "The Redis options to connect to Redis Server.",
    format: Object,
    default: {},
    env: "REDIS_OPTIONS",
  },
  signing_secret: {
    doc:
      "The shared secret to use to sign JSON Web Tokens (JWT) with the selected signing algorithm.",
    format: "*",
    default: "keyboard cat", // TODO: (wyattjoh) evaluate best solution
    env: "SIGNING_SECRET",

    sensitive: true,
  },
  signing_algorithm: {
    doc: "The signing algorithm used to sign JSON Web Tokens (JWT).",
    format: algorithms,
    default: "HS256",
    env: "SIGNING_ALGORITHM",
  },
  management_signing_secret: {
    doc: "The secret used to verify management API requests.",
    format: "*",
    default: null,
    env: "MANAGEMENT_SIGNING_SECRET",

    sensitive: true,
  },
  management_signing_algorithm: {
    doc: "The algorithm used to sign management API requests",
    format: algorithms,
    default: "HS256",
    env: "MANAGEMENT_SIGNING_ALGORITHM",
  },
  logging_level: {
    doc: "The logging level to print to the console",
    format: ["fatal", "error", "warn", "info", "debug", "trace"],
    default: "info",
    env: "LOGGING_LEVEL",
  },
  static_uri: {
    doc: "The URL that static assets will be hosted from",
    format: "optional-url",
    default: "",
    env: "STATIC_URI",
  },
  websocket_keep_alive_timeout: {
    doc:
      "The keepalive timeout (in ms) that should be used to send keep alive messages through the websocket to keep the socket alive",
    format: "ms",
    default: "30 seconds",
    env: "WEBSOCKET_KEEP_ALIVE_TIMEOUT",
  },
  disable_tenant_caching: {
    doc:
      "Disables the tenant caching, all tenants will be loaded from MongoDB each time it's needed",
    format: Boolean,
    default: false,
    env: "DISABLE_TENANT_CACHING",
  },
  disable_live_updates: {
    doc:
      "Disables subscriptions for the comment stream for all stories across all tenants",
    format: Boolean,
    default: false,
    env: "DISABLE_LIVE_UPDATES",
  },
  disable_live_updates_timeout: {
    doc:
      "Disables subscriptions for the comment stream for all stories across all tenants where a comment has not been left within the timeout",
    format: "ms",
    default: "2 weeks",
    env: "DISABLE_LIVE_UPDATES_TIMEOUT",
  },
  disable_client_routes: {
    doc:
      "Disables mounting of client routes for developing with Webpack Dev Server",
    format: Boolean,
    default: false,
    env: "DISABLE_CLIENT_ROUTES",
  },
  disable_rate_limiters: {
    doc:
      "Disables the rate limiters in development. This will only work when also set to a development environment",
    format: Boolean,
    default: false,
    env: "DISABLE_RATE_LIMITERS",
  },
  scrape_timeout: {
    doc: "The request timeout (in ms) for scraping operations.",
    format: "ms",
    default: "10 seconds",
    env: "SCRAPE_TIMEOUT",
  },
  perspective_timeout: {
    doc:
      "The request timeout (in ms) for perspective comment checking operations.",
    format: "ms",
    default: "800 milliseconds",
    env: "PERSPECTIVE_TIMEOUT",
  },
  force_ssl: {
    doc:
      "Forces SSL in production by redirecting all HTTP requests to HTTPS, and sending HSTS headers.",
    format: Boolean,
    default: false,
    env: "FORCE_SSL",
  },
  disable_job_processors: {
    doc: "Disables job processors when running.",
    format: Boolean,
    default: false,
    env: "DISABLE_JOB_PROCESSORS",
  },
});

export type Config = typeof config;

// Setup the base configuration.
export default config;
