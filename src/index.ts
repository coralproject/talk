import dotenv from "dotenv";

// Apply all the configuration provided in the .env file if it isn't already in
// the environment.
dotenv.config();

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

    // Connect the server to databases.
    await server.connect();

    // Start the server.
    await server.start(app);
  } catch (err) {
    logger.error({ err }, "can not start server in worker mode");
  }
}

// master will start the master process.
async function master(server: Server) {
  try {
    // Connect the server to databases.
    await server.connect();

    // Process jobs.
    await server.process();
  } catch (err) {
    logger.error({ err }, "can not start server in master mode");
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

    if (workerCount === 1) {
      logger.debug(
        { workerCount },
        "not utilizing cluster as concurrency level is 1"
      );

      // Connect the server to databases.
      await server.connect();

      // Process jobs.
      await server.process();

      // Start the server.
      await server.start(app);
    } else {
      logger.debug({ workerCount }, "spawning workers to handle traffic");

      // Launch the server start within throng.
      throng({
        workers: workerCount,
        start: () => worker(server),
        master: () => master(server),
      });
    }
  } catch (err) {
    logger.error({ err }, "can not bootstrap server");
  }
}

bootstrap();
