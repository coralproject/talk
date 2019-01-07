import bunyan, { LogLevelString, stdSerializers as serializers } from "bunyan";
import PrettyStream from "bunyan-prettystream";
import cluster from "cluster";
import { Transform, TransformCallback } from "stream";

import config from "talk-server/config";

class SecretStream extends Transform {
  private static keys = "(key|clientID|clientSecret|password|func)";
  private static pattern = new RegExp(
    `"(${SecretStream.keys})":"([^"]*)"`,
    "ig"
  );

  private static replace(chunk: string): string {
    return chunk.replace(SecretStream.pattern, `"$1":"[Sensitive]"`);
  }

  public _transform(
    chunk: string | object | Buffer,
    encoding: string,
    callback: TransformCallback
  ) {
    try {
      if (typeof chunk === "string") {
        this.push(SecretStream.replace(chunk));
      } else if (Buffer.isBuffer(chunk)) {
        this.push(SecretStream.replace(chunk.toString()));
      } else {
        this.push(SecretStream.replace(JSON.stringify(chunk)));
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }

    callback();
  }
}

function getStreams() {
  // If we aren't in production mode, use the pretty stream printer.
  if (config.get("env") !== "production") {
    const pretty = new PrettyStream();

    // Pipe the pretty stream to stdout.
    pretty.pipe(process.stdout);

    return [{ type: "raw", stream: pretty }];
  }

  // Create a new secret stream.
  const secret = new SecretStream();

  // Pipe the stream to stdout.
  secret.pipe(process.stdout);

  // In production, emit JSON.
  return [{ type: "stream", stream: secret }];
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
