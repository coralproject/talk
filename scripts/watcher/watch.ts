import chalk from "chalk";
import Joi from "joi";
import { pickBy } from "lodash";

import SaneWatcher from "./SaneWatcher";
import { Config, configSchema, Options, WatchConfig, Watcher } from "./types";

// Polyfill the asyncIterator symbol.
if (Symbol.asyncIterator === undefined) {
  (Symbol as any).asyncIterator = Symbol.for("asyncIterator");
}

async function beginWatch(
  watcher: Watcher,
  key: string,
  config: WatchConfig,
  rootDir: string
) {
  const { paths, ignore, executor } = config;
  if (executor.onInit) {
    await executor.onInit();
  }
  for await (const filePath of watcher.watch(rootDir, paths, { ignore })) {
    // eslint-disable-next-line no-console
    console.log(
      chalk.cyanBright(`Execute "${key}" `) +
        chalk.grey(`["${filePath}" changed]`)
    );
    executor.execute(filePath);
  }
}

function setupCleanup(watcher: Watcher, config: Config) {
  ["SIGINT", "SIGTERM"].forEach((signal) =>
    process.once(signal as any, async () => {
      const cleanups = [];
      if (watcher.onCleanup) {
        cleanups.push(watcher.onCleanup());
      }
      for (const key of Object.keys(config.watchers)) {
        if (config.watchers[key].executor.onCleanup) {
          cleanups.push(config.watchers[key].executor.onCleanup!());
        }
      }
      await Promise.all(cleanups);
      process.exit(0);
    })
  );
}

function resolveSets(
  sets: Record<string, ReadonlyArray<string>>,
  value: ReadonlyArray<string>
) {
  const resolved: string[] = [];
  value.forEach((v) => {
    if (v in sets) {
      resolved.push(...sets[v]);
      return;
    }
    resolved.push(v);
  });
  return resolved;
}

function filterOnly(
  watchers: Config["watchers"],
  only: ReadonlyArray<string>,
  sets?: Record<string, ReadonlyArray<string>>
): Config["watchers"] {
  const resolved = sets ? resolveSets(sets, only) : only;
  const unknown = resolved.filter((r) => !(r in watchers));
  if (unknown.length) {
    throw new Error(`Watcher Configuration or Set for ${unknown} not found`);
  }
  return pickBy(watchers, (value, key) => {
    if (!resolved.includes(key)) {
      // eslint-disable-next-line no-console
      console.log(chalk.grey(`Disabled watcher "${key}"`));
      return false;
    }
    return true;
  }) as Config["watchers"];
}

export default async function watch(
  config: Config,
  options: Options = {}
): Promise<void> {
  Joi.assert(config, configSchema);
  const watcher: Watcher = config.backend || new SaneWatcher();
  const rootDir = config.rootDir || process.cwd();
  const defaultSet = config.defaultSet && [config.defaultSet];
  const only = options.only && options.only.length ? options.only : defaultSet;

  let watchersConfigs = config.watchers;
  if (only) {
    watchersConfigs = filterOnly(watchersConfigs, only, config.sets);
  }

  setupCleanup(watcher, config);
  if (watcher.onInit) {
    await watcher.onInit();
  }

  for (const key of Object.keys(watchersConfigs)) {
    // eslint-disable-next-line no-console
    console.log(chalk.cyanBright(`Start watcher "${key}"`));
    const watcherConfig = watchersConfigs[key];
    beginWatch(watcher, key, watcherConfig, rootDir).catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      process.exit(1);
    });
  }
}
