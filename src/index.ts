import "reflect-metadata";

import dotenv from "dotenv";
import { rewrite } from "env-rewrite";
import sourceMapSupport from "source-map-support";

// Configure the source map support so stack traces will reference the source
// files rather than the transpiled code.
sourceMapSupport.install({
  environment: "node",
});

// Ensure that we always process the rewrites silently, otherwise it may fail in
// environments like Heroku.
process.env.REWRITE_ENV_SILENT = "TRUE";

// Perform rewrites to the runtime environment variables based on the contents
// of the process.env.REWRITE_ENV if it exists. This is done here as it is the
// entrypoint for the entire applications configuration.
rewrite();

// Apply all the configuration provided in the .env file if it isn't already in
// the environment.
dotenv.config();

// NOTE: It is required for the `dotenv` module to be configured before other
// modules to ensure the rewriting takes place before those modules load!

import { container } from "tsyringe";

import Server from "./core/server";
import { CONFIG, Config, createConfig } from "./core/server/config";
import logger from "./core/server/logger";
import { createMongoDB, MONGO, Mongo } from "./core/server/services/mongodb";
import { createRedis, REDIS, Redis } from "./core/server/services/redis";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

// bootstrap will create a new Coral server, and start it up.
async function bootstrap() {
  try {
    logger.debug("starting bootstrap");

    // Get the configuration for the application.
    const config = createConfig();

    logger.debug({ config: config.toString() }, "loaded configuration");

    // Register the configuration.
    container.register<Config>(CONFIG, { useValue: config });

    // Register the MongoDB connection as it will be reused because there is
    // only one per application.
    const mongo = await createMongoDB(config);
    container.register<Mongo>(MONGO, { useValue: mongo });

    // Register this Redis connection as it will be re-used.
    const redis = createRedis(config);
    container.register<Redis>(REDIS, { useValue: redis });

    // Create the server instance.
    const server = container.resolve(Server);

    // Connect the server to databases.
    await server.connect();

    // Start processing jobs.
    await server.process();

    // Start the server.
    await server.start();
  } catch (err) {
    logger.error({ err }, "can not bootstrap server");
    throw err;
  }
}

bootstrap().catch(() => {
  process.exit(1);
});
