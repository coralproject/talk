import createTalk from "./core";
import express from "express";

// Create the app that will serve as the mounting point for the Talk Server.
const app = express();

async function bootstrap() {
  try {
    // Create the server instance.
    const server = await createTalk();

    // Start the server.
    await server.start(app);
  } catch (err) {}
}

bootstrap();
