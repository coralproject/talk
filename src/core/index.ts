import Server, { ServerOptions } from './server';

/**
 * Create a Talk Server.
 *
 * @param options ServerOptions that will be used to configure Talk.
 */
export default async function createTalk(
    options: ServerOptions = {}
): Promise<Server> {
    // Create the server with the provided options.
    return new Server(options);
}
