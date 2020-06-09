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
process.on("unhandledRejection", (err) => {
  throw err;
});

import express from "express";

import createCoral from "./core";
import logger from "./core/server/logger";

// Create the app that will serve as the mounting point for the Coral Server.
const parent = express();

// bootstrap will create a new Coral server, and start it up.
async function bootstrap() {
  try {
    logger.debug("starting bootstrap");

    // Create the server instance.
    const server = createCoral();

    // Connect the server to databases.
    await server.connect();

    // Start processing jobs.
    await server.process();

    // Start the server.
    await server.start({ parent });
  } catch (err) {
    logger.error({ err }, "can not bootstrap server");
    throw err;
  }
}

bootstrap().catch(() => {
  process.exit(1);
});
