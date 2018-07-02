import ChokidarWatcher from "./watcher/ChokidarWatcher";
import CommandExecutor from "./watcher/CommandExecutor";
import { Executor } from "./watcher/types";

if (Symbol.asyncIterator === undefined) {
  (Symbol as any).asyncIterator = Symbol.for("asyncIterator");
}

export type Config = WatchConfig[];

export interface WatchConfig {
  path: string;
  extensions: string[];
  executor: Executor;
}

export default async function watch(config: Config) {
  const client = new ChokidarWatcher();

  config.map(async ({ path, executor, extensions }) => {
    for await (const filePath of client.watch(path, extensions)) {
      // tslint:disable-next-line: no-console
      console.log(filePath);
      executor.execute(filePath);
    }
  });
}
