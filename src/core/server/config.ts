import bytes from "bytes";
import convict from "convict";
import convict_format_with_validator from "convict-format-with-validator";
import Joi from "joi";
import { compact } from "lodash";
import { parseConnectionString } from "mongodb-core";
import ms from "ms";

import { DEFAULT_AUTO_ARCHIVE_OLDER_THAN } from "coral-common/constants";
import { LOCALES } from "coral-common/helpers/i18n/locales";
import { ensureEndSlash } from "coral-common/utils";

import { WrappedInternalError } from "./errors";

// Needed for the url format.
convict.addFormats(convict_format_with_validator);

// Add custom format for the mongo uri scheme.
convict.addFormat({
  name: "mongo-uri",
  validate: (url: string) => {
    parseConnectionString(url, (err) => {
      if (err) {
        throw new WrappedInternalError(err, "invalid mongo-uri");
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

// Add a custom format for the optional-trailing-url that includes a trailing
// slash.
convict.addFormat({
  name: "optional-trailing-url",
  validate: (url: string) => {
    if (url) {
      Joi.assert(url, Joi.string().uri());
    }
  },
  // Ensure that there is an ending slash.
  coerce: (url: string) => (url ? ensureEndSlash(url) : url),
});

// Add a custom format for the optional-url.
convict.addFormat({
  name: "optional-url",
  validate: (url: string) => {
    if (url) {
      Joi.assert(url, Joi.string().uri());
    }
  },
});

// Add a custom format for domain.
convict.addFormat({
  name: "domain",
  validate: (domain: string) => {
    if (domain) {
      Joi.assert(domain, Joi.string().domain());
    }
  },
});

// Add a custom format for a list of comma seperated strings.
convict.addFormat({
  name: "list",
  validate: (list: string[]) => {
    if (!list || list.length === 0) {
      throw new Error("list should not contain empty entries");
    }
  },
  coerce: (list: string) => compact(list.split(",").map((item) => item.trim())),
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

// Add a custom format that is a number of bytes parsed with `bytes`. This
// allows more compact representations of values (10mb instead of 10e6).
convict.addFormat({
  name: "bytes",
  validate: (val: number) => {
    Joi.assert(val, Joi.number().positive().integer().required());
  },
  coerce: (val: string): number => bytes(val),
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
    doc: "Specify the default locale to use for all requests without a locale specified",
    format: LOCALES,
    default: "en-US",
    env: "LOCALE",
  },
  trust_proxy: {
    doc: 'When provided, it configures the "trust proxy" settings for Express (See https://expressjs.com/en/guide/behind-proxies.html)',
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
  mongodb_archive: {
    doc: "The MongoDB database to connect for archiving stories.",
    format: "mongo-uri",
    default: "mongodb://127.0.0.1:27017/coral",
    env: "MONGODB_ARCHIVE_URI",
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
    doc: "The shared secret to use to sign JSON Web Tokens (JWT) with the selected signing algorithm.",
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
    format: "optional-trailing-url",
    default: "",
    env: "STATIC_URI",
  },
  graphql_subscription_uri: {
    doc: "The URL that should be used for GraphQL subscription traffic over websockets. Example: wss://yourdomain.com/api/graphql/live",
    format: "optional-url",
    default: "",
    env: "GRAPHQL_SUBSCRIPTION_URI",
  },
  websocket_keep_alive_timeout: {
    doc: "The keepalive timeout (in ms) that should be used to send keep alive messages through the websocket to keep the socket alive",
    format: "ms",
    default: ms("30 seconds"),
    env: "WEBSOCKET_KEEP_ALIVE_TIMEOUT",
  },
  disable_tenant_caching: {
    doc: "Disables the tenant caching, all tenants will be loaded from MongoDB each time it's needed",
    format: Boolean,
    default: false,
    env: "DISABLE_TENANT_CACHING",
  },
  disable_live_updates: {
    doc: "Disables subscriptions for the comment stream for all stories across all tenants",
    format: Boolean,
    default: false,
    env: "DISABLE_LIVE_UPDATES",
  },
  disable_live_updates_timeout: {
    doc: "Disables subscriptions for the comment stream for all stories across all tenants where a comment has not been left within the timeout",
    format: "ms",
    default: ms("2 weeks"),
    env: "DISABLE_LIVE_UPDATES_TIMEOUT",
  },
  disable_rate_limiters: {
    doc: "Disables the rate limiters in development. This will only work when also set to a development environment",
    format: Boolean,
    default: false,
    env: "DISABLE_RATE_LIMITERS",
  },
  scrape_max_response_size: {
    doc: "The maximum size (in bytes) to allow for scraping responses.",
    format: "bytes",
    default: bytes("10mb"),
    env: "SCRAPE_MAX_RESPONSE_SIZE",
  },
  max_request_size: {
    doc: "The maximum size (in bytes) to allow for post bodies to accept.",
    format: "bytes",
    default: bytes("500kb"),
    env: "MAX_REQUEST_SIZE",
  },
  scrape_timeout: {
    doc: "The request timeout (in ms) for scraping operations.",
    format: "ms",
    default: ms("10 seconds"),
    env: "SCRAPE_TIMEOUT",
  },
  perspective_timeout: {
    doc: "The request timeout (in ms) for perspective comment checking operations.",
    format: "ms",
    default: ms("800 milliseconds"),
    env: "PERSPECTIVE_TIMEOUT",
  },
  story_viewer_timeout: {
    doc: "The length of time (in ms) that a user should be considered active on a story without interaction.",
    format: "ms",
    default: ms("15 minutes"),
    env: "STORY_VIEWER_TIMEOUT",
  },
  force_ssl: {
    doc: "Forces SSL in production by redirecting all HTTP requests to HTTPS, and sending HSTS headers.",
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
  word_list_timeout: {
    doc: "The word list timeout (in ms) that should be used to limit the amount of time the process is frozen processing a word list comparison",
    format: "ms",
    default: ms("100ms"),
    env: "WORD_LIST_TIMEOUT",
  },
  sentry_frontend_key: {
    format: String,
    default: "",
    env: "SENTRY_FRONTEND_KEY",
  },
  sentry_backend_key: {
    format: String,
    default: "",
    env: "SENTRY_BACKEND_KEY",
  },
  analytics_frontend_key: {
    doc: "Analytics write key from RudderStack for the Javascript client.",
    format: String,
    default: "",
    env: "ANALYTICS_FRONTEND_KEY",
  },
  analytics_backend_key: {
    doc: "Analytics write key from RudderStack for the Node server.",
    format: String,
    default: "",
    env: "ANALYTICS_BACKEND_KEY",
  },
  analytics_frontend_sdk_url: {
    doc: "Analytics URL to the RudderStack Frontend JS SDK. Defaults to the ",
    format: "optional-trailing-url",
    default: "https://cdn.rudderlabs.com/v1/rudder-analytics.min.js",
    env: "ANALYTICS_FRONTEND_SDK_URL",
  },
  analytics_data_plane_url: {
    doc: "Analytics URL to the RudderStack data plane instance.",
    format: "optional-trailing-url",
    default: "",
    env: "ANALYTICS_DATA_PLANE_URL",
  },
  jsonp_cache_max_age: {
    doc: "The max age for jsonp endpoints designed to be used as embeddable scripts.",
    format: "ms",
    default: ms("2m"),
    env: "JSONP_CACHE_MAX_AGE",
  },
  jsonp_cache_immutable: {
    doc: "When enabled, jsonp endpoints designed to be used as embeddable scripts will have an immutable directive added to the cache control headers.",
    format: Boolean,
    default: false,
    env: "JSONP_CACHE_IMMUTABLE",
  },
  jsonp_response_cache: {
    doc: "When enabled, will enable caching JSONP responses in Redis.",
    format: Boolean,
    default: false,
    env: "JSONP_RESPONSE_CACHE",
  },
  default_graphql_cache_max_age: {
    doc: "Specifies the max age for the GraphQL requests. Must be larger than 1 second.",
    format: "ms",
    default: ms("30 seconds"),
    env: "DEFAULT_GRAPHQL_CACHE_MAX_AGE",
  },
  graphql_response_cache: {
    doc: "When enabled, will enable caching GraphQL responses in Redis.",
    format: Boolean,
    default: false,
    env: "GRAPHQL_RESPONSE_CACHE",
  },
  graphql_cache_headers: {
    doc: "When enabled, Coral will send Cache-Control headers along with GraphQL requests. If this is not enabled, the response cache is also not enabled.",
    format: Boolean,
    default: false,
    env: "GRAPHQL_CACHE_HEADERS",
  },
  nodejs_keep_alive_timeout: {
    doc: "Specifies the keep alive timeout to set for the HTTP server used by Coral.",
    format: "ms",
    default: ms("5s"),
    env: "NODEJS_KEEP_ALIVE_TIMEOUT",
  },
  nodejs_headers_timeout: {
    doc: "Specifies the headers timeout to set for the HTTP server used by Coral.",
    format: "ms",
    default: ms("1m"),
    env: "NODEJS_HEADERS_TIMEOUT",
  },
  google_cloud_profiler: {
    doc: "When enabled, will start the Google Cloud Profiler using the default application credentials.",
    format: Boolean,
    default: false,
    env: "GOOGLE_CLOUD_PROFILER",
  },
  google_cloud_profiler_service_context: {
    doc: "Passed down to the Google Cloud Profiler if enabled as `{ serviceContext }`.",
    format: Object,
    default: {},
    env: "GOOGLE_CLOUD_PROFILER_SERVICE_CONTEXT",
  },
  amp_cache_domains: {
    doc: "Specifies the amp cache domains as a comma seperated list",
    format: "list",
    default: ["cdn.ampproject.org"],
    env: "AMP_CACHE_DOMAINS",
  },
  smtp_transport_send_max: {
    doc: "Maximum number of emails that a given transport can send before it's reset.",
    env: "SMTP_TRANSPORT_SEND_MAX",
    format: Number,
    default: 50,
  },
  smtp_transport_timeout: {
    doc: "Maximum time that the transport can take sending a Email before it aborts.",
    format: "ms",
    default: ms("20s"),
    env: "SMTP_TRANSPORT_TIMEOUT",
  },
  mailer_job_timeout: {
    doc: "Maximum time that the mailer can take to process any mailer jobs before it aborts.",
    format: "ms",
    default: ms("30s"),
    env: "MAILER_JOB_TIMEOUT",
  },
  download_gdpr_comments_link_domain: {
    doc: "Specifies an alternative domain to be used for the download GDPR comments link sent out in emails. If set to default empty string, will use the tenant domain. Example: yourdomain.com",
    format: "domain",
    default: "",
    env: "DOWNLOAD_GDPR_COMMENTS_LINK_DOMAIN",
  },
  non_fingerprinted_cache_max_age: {
    doc: "Max age for the ",
    format: "ms",
    default: ms("30 minutes"),
    env: "NON_FINGERPRINTED_CACHE_MAX_AGE",
  },
  enable_auto_archiving: {
    doc: "Enables auto archiving for stories older than the specified interval.",
    format: Boolean,
    default: false,
    env: "ENABLE_AUTO_ARCHIVING",
  },
  auto_archive_older_than: {
    doc: "If stories are older than this age, they will be auto archived if auto archiving is enabled.",
    format: "ms",
    default: DEFAULT_AUTO_ARCHIVE_OLDER_THAN,
    env: "AUTO_ARCHIVE_OLDER_THAN",
  },
  auto_archiving_interval: {
    doc: "The cron scheduling interval for how often auto archiving should run.",
    format: String,
    default: "0,15,30,45 * * * *",
    env: "AUTO_ARCHIVING_INTERVAL",
  },
  auto_archiving_batch_size: {
    doc: "Determines how many stories to try and archive per interval of archiving.",
    format: Number,
    default: 500,
    env: "AUTO_ARCHIVING_BATCH_SIZE",
  },
  force_admin_local_auth: {
    doc: "Will force local auth in the admin to on so that it cannot be turned off.",
    format: Boolean,
    default: false,
    env: "FORCE_ADMIN_LOCAL_AUTH",
  },
  signin_window_title: {
    doc: "Will override the title of the window that opens when users are signing in via local auth.",
    format: String,
    default: "Sign in",
    env: "SIGNIN_WINDOW_TITLE",
  },
});

export type Config = typeof config;

// Setup the base configuration.
export default config;
