import PrettyStream from "@coralproject/bunyan-prettystream";

import config from "coral-server/config";

import { SecretStream } from "./SecretStream";

export function getStreams() {
  // Create a new secret stream.
  const secret = new SecretStream();

  // If we aren't in production mode, use the pretty stream printer.
  if (config.get("env") !== "production") {
    const pretty = new PrettyStream();

    // Pipe the secret stream to pretty.
    secret.pipe(pretty);

    // Pipe the pretty stream to stdout.
    pretty.pipe(process.stdout);

    return [{ type: "raw", stream: pretty }];
  }

  // Pipe the stream to stdout.
  secret.pipe(process.stdout);

  // In production, emit JSON.
  return [{ type: "stream", stream: secret }];
}
