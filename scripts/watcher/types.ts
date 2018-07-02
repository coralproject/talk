export interface Watcher {
  watch(path: string, extensions: string[]): AsyncIterable<string>;
}

export interface Executor {
  execute(filePath: string): void;
}
