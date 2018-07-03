import Joi from "joi";

export interface WatchOptions {
  ignore?: ReadonlyArray<string>;
}

export interface Watcher {
  watch(
    paths: ReadonlyArray<string>,
    options?: WatchOptions
  ): AsyncIterable<string>;
}

export interface Executor {
  onInit?(): void;
  onCleanup?(): void;
  execute(filePath: string): void;
}

export interface Config {
  rootDir?: string;
  watcher?: Watcher;
  watchers: {
    [key: string]: WatchConfig;
  };
}

export interface WatchConfig {
  paths: ReadonlyArray<string>;
  ignore?: ReadonlyArray<string>;
  executor: Executor;
}

export const configSchema = Joi.object({
  rootDir: Joi.string().optional(),
  watcher: Joi.object().optional(),
  watchers: Joi.object().pattern(
    /.*/,
    Joi.object({
      paths: Joi.array()
        .items(Joi.string())
        .unique(),
      ignore: Joi.array()
        .items(Joi.string())
        .unique()
        .optional(),
      executor: Joi.object(),
    })
  ),
});
