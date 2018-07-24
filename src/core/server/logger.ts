import bunyan, { LogLevelString } from "bunyan";

import config from "talk-server/config";

const logger = bunyan.createLogger({
  name: "talk",
  serializers: bunyan.stdSerializers,
  // TODO: (wyattjoh) move this into some managed instance?
  level: config.get("logging_level") as LogLevelString,
});

export default logger;
