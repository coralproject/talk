import Logger from "bunyan";
import cors from "cors";
import express from "express";

import { config } from "dotenv";

const createLogger = () => {
  return Logger.createLogger({
    name: "coral-dev-cdn",
    src: true,
    level: "debug",
    color: true,
  });
};

const run = () => {
  config();

  const port = process.env.CDN_PORT ? parseInt(process.env.CDN_PORT, 10) : 3001;

  const logger = createLogger();
  const app = express();

  app.use(cors());

  app.use("/", express.static("dist/static"));

  app.get("/up", (req, res) => {
    res.send("coral:fakeCDN");
  });

  app.listen(port, () => {
    logger.info({ port }, "server is listening");
  });
};

run();
