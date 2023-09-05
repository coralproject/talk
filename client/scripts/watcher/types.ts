import Joi from "joi";

export interface WatchOptions {
  ignore?: ReadonlyArray<string>;
}

export interface Watcher {
  onInit?(): void | Promise<void>;
  onCleanup?(): void | Promise<void>;
  watch(
    rootDir: string,
    paths: ReadonlyArray<string>,
    options?: WatchOptions
  ): AsyncIterable<string>;
}

export interface Executor {
  onInit?(): void | Promise<void>;
  onCleanup?(): void | Promise<void>;
  execute(filePath: string): void;
}

export interface Options {
  only?: ReadonlyArray<string>;
}

export interface Config {
  rootDir?: string;
  backend?: Watcher;
  watchers: Record<string, WatchConfig>;
  defaultSet?: string;
  sets?: Record<string, ReadonlyArray<string>>;
}

export interface WatchConfig {
  paths: ReadonlyArray<string>;
  ignore?: ReadonlyArray<string>;
  executor: Executor;
}

export const configSchema = Joi.object({
  rootDir: Joi.string().optional(),
  backend: Joi.object().optional(),
  watchers: Joi.object().pattern(
    /.*/,
    Joi.object({
      paths: Joi.array().items(Joi.string()).unique(),
      ignore: Joi.array().items(Joi.string()).unique().optional(),
      executor: Joi.object(),
    })
  ),
  defaultSet: Joi.string().optional(),
  sets: Joi.object()
    .pattern(/.*/, Joi.array().items(Joi.string()).unique())
    .optional(),
}).with("defaultSet", "sets");
