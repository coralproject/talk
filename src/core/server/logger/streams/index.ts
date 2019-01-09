import PrettyStream from "bunyan-prettystream";

import config from "talk-server/config";

import { SecretStream } from "./SecretStream";

export function getStreams() {
  // If we aren't in production mode, use the pretty stream printer.
  if (config.get("env") === "production") {
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
