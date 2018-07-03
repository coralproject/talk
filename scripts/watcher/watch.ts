import path from "path";
import ChokidarWatcher from "./ChokidarWatcher";
import { Executor, Watcher } from "./types";

export interface Config {
  rootDir?: string;
  watchers: {
    [key: string]: WatchConfig;
  };
}

export interface WatchConfig {
  paths: ReadonlyArray<string>;
  ignore?: ReadonlyArray<string>;
  executor: Executor;
}

// polyfill the async symbol.
if (Symbol.asyncIterator === undefined) {
  (Symbol as any).asyncIterator = Symbol.for("asyncIterator");
}

async function beginWatch(watcher: Watcher, key: string, config: WatchConfig) {
  const { paths, ignore, executor } = config;
  if (executor.onInit) {
    executor.onInit();
  }
  for await (const filePath of watcher.watch(paths, { ignore })) {
    // tslint:disable-next-line:no-console
    console.log(`Execute "${key}"`);
    executor.execute(filePath);
  }
}

function prependRootDir(prepend: string, cfg: WatchConfig): WatchConfig {
  const prependFunc = (p: string) => path.resolve(prepend, p);
  return {
    ...cfg,
    paths: cfg.paths.map(prependFunc),
    ignore: cfg.ignore ? cfg.ignore.map(prependFunc) : undefined,
  };
}

function setupCleanup(config: Config) {
  ["SIGINT", "SIGTERM"].forEach(signal =>
    process.once(signal as any, () => {
      for (const key of Object.keys(config.watchers)) {
        if (config.watchers[key].executor.onCleanup) {
          config.watchers[key].executor.onCleanup!();
        }
      }
      process.exit(0);
    })
  );
}

export default async function watch(config: Config) {
  const watcher = new ChokidarWatcher();
  setupCleanup(config);
  for (const key of Object.keys(config.watchers)) {
    // tslint:disable-next-line:no-console
    console.log(`Start watcher "${key}"`);
    const watcherConfig = config.rootDir
      ? prependRootDir(config.rootDir, config.watchers[key])
      : config.watchers[key];
    beginWatch(watcher, key, watcherConfig);
  }
}
