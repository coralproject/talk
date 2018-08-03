import dotenv from "dotenv";

// Apply all the configuration provided in the .env file if it isn't already in
// the environment.
dotenv.config();

import express from "express";

import logger from "talk-server/logger";

import createTalk from "./core";

// Create the app that will serve as the mounting point for the Talk Server.
const app = express();

async function bootstrap() {
  try {
    // Create the server instance.
    const server = await createTalk();

    // Start the server.
    await server.start(app);
  } catch (err) {
    logger.error({ err }, "can not bootstrap server");
  }
}

bootstrap();
