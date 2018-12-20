import bunyan, { LogLevelString, stdSerializers as serializers } from "bunyan";
import PrettyStream from "bunyan-prettystream";
import cluster from "cluster";

import config from "talk-server/config";

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

  // Attach the cluster node information to the log entries.
  clusterNode: cluster.worker ? `worker.${cluster.worker.id}` : "master",

  // Include file references in log entries.
  src: true,
  serializers,
  streams: getStreams(),
  level: config.get("logging_level") as LogLevelString,
});

export default logger;
