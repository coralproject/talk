import bunyan, { LogLevelString } from "bunyan";
import cluster from "cluster";

import config from "talk-server/config";

import serializers from "./serializers";
import { getStreams } from "./streams";

export type Logger = ReturnType<typeof bunyan.createLogger>;

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
