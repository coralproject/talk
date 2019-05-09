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

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

import express from "express";
import throng from "throng";

import createTalk from "./core";
import Server from "./core/server";
import logger from "./core/server/logger";

// Create the app that will serve as the mounting point for the Talk Server.
const app = express();

// worker will start the worker process.
async function worker(server: Server) {
  try {
    logger.debug("started server worker");

    // Start the server.
    await server.start(app);
  } catch (err) {
    logger.error({ err }, "can not start server in worker mode");
    throw err;
  }
}

// master will start the master process.
async function master(server: Server) {
  const workerCount = server.config.get("concurrency");
  logger.debug({ workerCount }, "spawning workers to handle traffic");

  try {
    logger.debug("started server master");

    // Process jobs.
    await server.process();
  } catch (err) {
    logger.error({ err }, "can not start server in master mode");
    throw err;
  }
}

// bootstrap will create a new Talk server, and start it up.
async function bootstrap() {
  try {
    logger.debug("starting bootstrap");

    // Create the server instance.
    const server = await createTalk();

    // Determine the number of workers.
    const workerCount = server.config.get("concurrency");

    // Connect the server to databases.
    await server.connect();

    if (workerCount === 1) {
      logger.debug(
        { workerCount },
        "not utilizing cluster as concurrency level is 1"
      );

      // Start processing jobs.
      await server.process();

      // Start the server.
      await server.start(app);
    } else {
      // Launch the server start within throng.
      throng({
        workers: workerCount,
        start: () => worker(server),
        master: () => master(server),
      });
    }
  } catch (err) {
    logger.error({ err }, "can not bootstrap server");
    throw err;
  }
}

bootstrap().catch(() => {
  process.exit(1);
});
