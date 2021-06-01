import TenantCache from "./cache";

export type DeconstructionFn<T> = (tenantID: string, value: T) => Promise<void>;

/**
 * TenantCacheAdapter is designed to allow additional services to cache entries
 * that are related to tenants that could possibly be cached. When caching of
 * tenants are enabled, this acts as a map to store entries, and will
 * automatically invalidate tenants that have been updated.
 */
export default class TenantCacheAdapter<T> {
  private readonly cache = new Map<string, T>();
  private readonly tenantCache: TenantCache;

  private readonly deconstructionFn?: DeconstructionFn<T>;
  private unsubscribeFn?: () => void;

  constructor(
    tenantCache: TenantCache,
    deconstructionFn?: DeconstructionFn<T>
  ) {
    this.tenantCache = tenantCache;
    this.deconstructionFn = deconstructionFn;

    // Subscribe to updates immediately.
    this.subscribe();
  }

  private handle = async (tenantID: string) => {
    // Get the current set value for the item in the cache.
    const value = this.get(tenantID);

    // Delete the tenant cache item when the tenant changes.
    this.cache.delete(tenantID);

    if (this.deconstructionFn) {
      // The deconstruction function is set. We will check that the value
      // exists, and if it does, we will call the function with the given
      // identifier, this allows the caller to attach deconstruction
      // components to the tenant being removed. The only side affect to
      // note is that by the time that the deconstruction function is
      // called, the tenant has already been purged from the cache.
      if (typeof value !== "undefined") {
        await this.deconstructionFn(tenantID, value);
      }
    }
  };

  /**
   * delete the cached instance (if cached) for this Tenant. This does not call
   * the optional deconstruction function.
   *
   * @param tenantID the tenantID for the cached item
   */
  public delete(tenantID: string) {
    if (this.tenantCache.cachingEnabled) {
      this.cache.delete(tenantID);
    }

    return;
  }

  public subscribe() {
    if (this.tenantCache.cachingEnabled && !this.unsubscribeFn) {
      this.unsubscribeFn = this.tenantCache.subscribe(
        ({ id }) => this.handle(id),
        (id) => this.handle(id)
      );
    }
  }

  /**
   * This will disconnect the map/cache from getting updates.
   */
  public unsubscribe() {
    if (this.tenantCache.cachingEnabled && this.unsubscribeFn) {
      this.unsubscribeFn();
    }
  }

  /**
   * get will return the cached entry keyed on the tenantID.
   *
   * @param tenantID the tenantID for the cached item
   */
  public get(tenantID: string): T | undefined {
    if (this.tenantCache.cachingEnabled) {
      return this.cache.get(tenantID);
    }

    return;
  }

  /**
   * set will set the cached entry into the map (if caching is enabled).
   *
   * @param tenantID the tenantID for the cached item
   * @param value the value to set in the map (if caching is enabled)
   */
  public set(tenantID: string, value: T) {
    if (this.tenantCache.cachingEnabled) {
      this.cache.set(tenantID, value);
    }
  }
}
