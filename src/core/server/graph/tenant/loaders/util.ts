/**
 * SingletonResolver is a cached loader for a single result.
 */
export class SingletonResolver<T> {
  private cache: Promise<T> | null = null;
  private resolver: () => Promise<T>;

  constructor(resolver: () => Promise<T>) {
    this.resolver = resolver;
  }

  public load() {
    if (this.cache) {
      return this.cache;
    }

    const promise = this.resolver().then(result => {
      return result;
    });

    // Set the promise on the cache.
    this.cache = promise;

    return promise;
  }
}
