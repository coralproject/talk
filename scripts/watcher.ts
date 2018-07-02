import pathNode from "path";
import ChokidarWatcher from "./watcher/ChokidarWatcher";
import CommandExecutor from "./watcher/CommandExecutor";
import { Executor } from "./watcher/types";

if (Symbol.asyncIterator === undefined) {
  (Symbol as any).asyncIterator = Symbol.for("asyncIterator");
}

type Config = WatchConfig[];

interface WatchConfig {
  extensions: string[];
  executor: Executor;
}

const config: Config = [
  {
    extensions: ["ts", "tsx"],
    executor: new CommandExecutor("npm", ["run", "compile:relay-stream"]),
  },
];

const dir = pathNode.resolve(__dirname, "../src");

async function start(config: Config) {
  const client = new ChokidarWatcher();

  config.map(async ({ executor, extensions }) => {
    for await (const filePath of client.watch(dir, extensions)) {
      // tslint:disable-next-line: no-console
      console.log(filePath);
      executor.execute(filePath);
    }
  });
}

start();
