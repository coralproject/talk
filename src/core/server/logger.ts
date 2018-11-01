import bunyan, { LogLevelString, stdSerializers as serializers } from "bunyan";
import PrettyStream from "bunyan-prettystream";

import config from "talk-common/config";

function getStreams() {
  // If we aren't in production mode, use the pretty stream printer.
  if (config.get("env") !== "production") {
    const pretty = new PrettyStream();
    pretty.pipe(process.stdout);

    return [{ type: "raw", stream: pretty }];
  }

  // In production, emit JSON.
  return [{ stream: process.stdout }];
}

const logger = bunyan.createLogger({
  name: "talk",

  // Include file references in log entries.
  src: true,
  serializers,
  streams: getStreams(),
  level: config.get("logging_level") as LogLevelString,
});

export default logger;
