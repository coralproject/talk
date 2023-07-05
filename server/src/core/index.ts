import Server, { ServerOptions } from "./server";

/**
 * Create a Coral Server.
 *
 * @param options ServerOptions that will be used to configure Coral.
 */
export default function createCoral(options: ServerOptions = {}): Server {
  // Create the server with the provided options.
  return new Server(options);
}
