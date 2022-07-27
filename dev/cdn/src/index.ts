import Logger from "bunyan";
import express from "express";

const PORT = 3001;

const createLogger = () => {
  return Logger.createLogger({
    name: "coral-dev-host",
    src: true,
    level: "debug",
    color: true,
  });
};

const run = () => {
  const logger = createLogger();
  const app = express();

  app.use("/", express.static("dist/static"));

  app.get("/up", (req, res) => {
    res.send("coral:fakeCDN");
  });

  app.listen(PORT, () => {
    logger.info({ port: PORT }, "server is listening");
  });
};

run();
