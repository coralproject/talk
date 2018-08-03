import convict from "convict";
import Joi from "joi";

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

const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 3000,
    env: "PORT",
    arg: "port",
  },
  mongodb: {
    doc: "The MongoDB database to connect to.",
    format: "mongo-uri",
    default: "mongodb://127.0.0.1:27017/talk",
    env: "MONGODB",
    arg: "mongodb",
  },
  redis: {
    doc: "The Redis database to connect to.",
    format: "redis-uri",
    default: "redis://127.0.0.1:6379",
    env: "REDIS",
    arg: "redis",
  },
  signing_secret: {
    doc: "",
    format: "*",
    default: "keyboard cat", // TODO: (wyattjoh) evaluate best solution
    env: "SIGNING_SECRET",
    arg: "signingSecret",
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
});

export type Config = typeof config;

export const createClientEnv = (c: Config) => ({
  NODE_ENV: c.get("env"),
});

// Setup the base configuration.
export default config;
