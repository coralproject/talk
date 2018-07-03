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
  watchers: {
    [key: string]: WatchConfig;
  };
}

export interface WatchConfig {
  paths: ReadonlyArray<string>;
  ignore?: ReadonlyArray<string>;
  executor: Executor;
}
