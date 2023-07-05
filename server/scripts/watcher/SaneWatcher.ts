import chalk from "chalk";
import { execSync } from "child_process";
import sane from "sane";

import { Watcher, WatchOptions } from "./types";

interface SaneWatcherOptions {
  /**
   * Set to true to use watchman, false to disabled, and undefined
   * for automatic detection.
   */
  watchman?: boolean;
  /** Use polling, this might be required for network file systems. */
  poll?: boolean;
}

function canUseWatchman(): boolean {
  try {
    execSync("watchman --version", { stdio: ["ignore"] });
    return true;
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return false;
}

export default class SaneWatcher implements Watcher {
  private watchman?: boolean;
  private poll: boolean;

  constructor(options: SaneWatcherOptions = {}) {
    this.watchman = options.watchman;
    this.poll = options.poll || false;

    // Autodetect watchman.
    if (this.watchman === undefined && canUseWatchman()) {
      this.watchman = true;
      // eslint-disable-next-line no-console
      console.log(chalk.grey(`Watchman detected`));
    }
  }

  public watch(
    rootDir: string,
    paths: ReadonlyArray<string>,
    options: WatchOptions = {}
  ): AsyncIterable<string> {
    // An array to hold all changes, that has not yet been yield.
    const queue: string[] = [];

    // If this is set, a pending promise is waiting for the next result.
    let pending: { resolve: (result: string) => void } | null = null;

    // Only start client if we have something to watch.
    if (paths.length) {
      // Setup client
      const client = sane(rootDir, {
        glob: paths as string[],
        ignored: options.ignore as string[],
        watchman: this.watchman,
        poll: this.poll,
      });

      // Listen for changes
      client.on("change", (pathFile: string) => {
        // Resolve pending request.
        if (pending) {
          pending.resolve(pathFile);
          pending = null;
          return;
        }

        // There is no pending request, save it into the queue.
        queue.unshift(pathFile);
      });
    }

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
              };

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
