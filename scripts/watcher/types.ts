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
