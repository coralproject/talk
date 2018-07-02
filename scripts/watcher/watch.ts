import ChokidarWatcher from "./ChokidarWatcher";
import { Executor } from "./types";

export type Config = WatchConfig[];
export interface WatchConfig {
  path: string;
  extensions: ReadonlyArray<string>;
  executor: Executor;
}

// polyfill the async symbol.
if (Symbol.asyncIterator === undefined) {
  (Symbol as any).asyncIterator = Symbol.for("asyncIterator");
}

export default async function watch(config: Config) {
  const watcher = new ChokidarWatcher();

  config.forEach(async ({ path, extensions, executor }) => {
    for await (const filePath of watcher.watch(path, extensions as string[])) {
      executor.execute(filePath);
    }
  });
}
