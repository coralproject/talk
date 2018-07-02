export interface Watcher {
  watch(path: string, extensions: ReadonlyArray<string>): AsyncIterable<string>;
}

export interface Executor {
  execute(filePath: string): void;
}
