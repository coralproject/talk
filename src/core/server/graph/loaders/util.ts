export interface SingletonResolverOptions {
  cacheable?: boolean;
}

/**
 * SingletonResolver is a cached loader for a single result.
 */
export class SingletonResolver<T> {
  private cache: Promise<T> | null = null;
  private resolver: () => Promise<T>;
  private cacheable: boolean;

  constructor(
    resolver: () => Promise<T>,
    { cacheable = true }: SingletonResolverOptions = {}
  ) {
    this.resolver = resolver;
    this.cacheable = cacheable;
  }

  public load() {
    if (!this.cacheable) {
      return this.resolver();
    }

    if (this.cache) {
      return this.cache;
    }

    const promise = this.resolver().then((result) => {
      return result;
    });

    // Set the promise on the cache.
    this.cache = promise;

    return promise;
  }
}

export function createManyBatchLoadFn<U, V>(
  batchLoadFn: (input: U) => Promise<V>
) {
  return (inputs: U[]) =>
    Promise.all(inputs.map((input) => batchLoadFn(input)));
}
