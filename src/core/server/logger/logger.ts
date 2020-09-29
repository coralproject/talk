import bunyan, { LogLevelString } from "bunyan";

import config from "coral-server/config";

import serializers from "./serializers";
import { getStreams } from "./streams";

export type Logger = ReturnType<typeof bunyan.createLogger>;

const logger = bunyan.createLogger({
  name: "coral",

  // Include file references in log entries.
  src: true,
  serializers,
  streams: getStreams(),
  level: config.get("logging_level") as LogLevelString,
});

export default logger;
