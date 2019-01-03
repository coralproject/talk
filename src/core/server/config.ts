import convict from "convict";
import Joi from "joi";
import os from "os";

// Add custom format for the mongo uri scheme.
convict.addFormat({
  name: "mongo-uri",
  validate: (url: string) => {
    Joi.assert(
      url,
      Joi.string().uri({
        scheme: ["mongodb"],
      })
    );
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

// Add a custom format for the optional-url.
convict.addFormat({
  name: "optional-url",
  validate: (url: string) => {
    if (url) {
      Joi.assert(url, Joi.string().uri());
    }
  },
  // Ensure that there is no ending slash.
  coerce: (url: string) => {
    return url.replace(/\/$/, "");
  },
});

const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  enable_graphiql: {
    doc: "When true, this will enable the GraphiQL routes",
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
    default: "mongodb://127.0.0.1:27017/talk",
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
  signing_secret: {
    doc: "",
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
  disable_tenant_caching: {
    doc:
      "Disables the tenant caching, all tenants will be loaded from MongoDB each time it's needed",
    format: Boolean,
    default: false,
    env: "DISABLE_TENANT_CACHING",
    arg: "disableTenantCaching",
  },
  disable_mongodb_autoindexing: {
    doc: "Disables the creation of new MongoDB indexes",
    format: Boolean,
    default: false,
    env: "DISABLE_MONGODB_AUTOINDEXING",
    arg: "disableMongodbAutoindexing",
  },
});

export type Config = typeof config;

// Setup the base configuration.
export default config;
