declare module "@coralproject/bunyan-prettystream" {
  // Type definitions for @coralproject/bunyan-prettystream
  // Project: https://www.npmjs.com/package/@coralproject/bunyan-prettystream
  // Definitions by: Jason Swearingen <https://github.com/jasonswearingen>, Vadim Macagon <https://github.com/enlight>
  // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

  import stream from "stream";

  export default class PrettyStream extends stream.Writable {
    constructor(options?: { mode?: string; useColor?: boolean });
    public pipe<T extends NodeJS.WritableStream>(
      destination: T,
      options?: { end?: boolean }
    ): T;
  }
}
