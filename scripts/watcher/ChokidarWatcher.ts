import chokidar from "chokidar";
import { Watcher } from "./types";

export default class ChokidarWatcher implements Watcher {
  public watch(path: string, extensions: string[]): AsyncIterable<string> {
    // tslint:disable-next-line:no-console
    console.log(`Chokidar watching ${path} for ${extensions} file changes`);
    const globs = extensions.map(e => `**/*.${e}`);
    const client = chokidar.watch(globs, {
      cwd: path,
    });

    // An array to hold all changes, that has not yet been yield.
    const queue: string[] = [];
    let firstError: Error | null = null;

    // If this is set, a pending promise is waiting for the next result.
    let pending:
      | ({ resolve: (result: string) => void; reject: (error: Error) => void })
      | null = null;

    // Listen for errors
    client.on("error", (error: Error) => {
      // Resolve pending request.
      if (pending) {
        pending.reject(error);
        pending = null;
        return;
      }
      if (!firstError) {
        firstError = error;
      }
    });

    // Listen for changes
    client.on("change", (pathFile: string) => {
      // Resolve pending request.
      if (pending) {
        pending.resolve(pathFile);
        pending = null;
        return;
      }

      // There sis no pending request, save it into the queue.
      queue.unshift(pathFile);
    });
    return {
      [Symbol.asyncIterator]() {
        return {
          next: () =>
            new Promise<IteratorResult<string>>((resolve, reject) => {
              const wrapped = {
                resolve: (pathFile: string) =>
                  resolve({
                    done: false,
                    value: pathFile,
                  }),
                reject: (error: Error) =>
                  reject({
                    done: true,
                    value: error,
                  }),
              };

              // We already have a change to return
              if (firstError) {
                wrapped.reject(firstError);
                return;
              }
              if (queue.length) {
                wrapped.resolve(queue.pop()!);
                return;
              }
              // We need to wait for the next change event.
              pending = wrapped;
            }),
        };
      },
    };
  }
}
