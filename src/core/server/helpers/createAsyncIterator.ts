export function createAsyncIterator<T>(fn: () => Promise<T | null>) {
  return {
    async *[Symbol.asyncIterator]() {
      while (true) {
        const doc = await fn();
        if (!doc) {
          break;
        }

        yield doc;
      }
    },
  };
}
