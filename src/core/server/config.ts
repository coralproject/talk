import convict from "convict";
import dotenv from "dotenv";
import Joi from "joi";

// Apply all the configuration provided in the .env file if it isn't already in
// the environment.
dotenv.config();

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
    default: "mongodb://localhost/talk",
    env: "MONGODB",
    arg: "mongodb",
  },
  redis: {
    doc: "The Redis database to connect to.",
    format: "redis-uri",
    default: "redis://localhost:6379",
    env: "REDIS",
    arg: "redis",
  },
  secret: {
    doc: "The secret used to sign and verify JWTs",
    format: "*",
    default: null,
    env: "SECRET",
    arg: "secret",
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

// Setup the base configuration.
export default config;
