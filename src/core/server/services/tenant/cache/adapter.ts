import { Config } from "talk-common/config";
import TenantCache from "talk-server/services/tenant/cache";

export type DeconstructionFn<T> = (tenantID: string, value: T) => Promise<void>;

/**
 * TenantCacheAdapter is designed to allow additional services to cache entries
 * that are related to tenants that could possibly be cached. When caching of
 * tenants are enabled, this acts as a map to store entries, and will
 * automatically invalidate tenants that have been updated.
 */
export class TenantCacheAdapter<T> {
  private cache = new Map<string, T>();
  private tenantCache: TenantCache;
  private isCachingEnabled: boolean;

  private unsubscribeFn?: () => void;
  private deconstructionFn?: DeconstructionFn<T>;

  constructor(
    tenantCache: TenantCache,
    config: Config,
    deconstructionFn?: DeconstructionFn<T>
  ) {
    this.tenantCache = tenantCache;
    this.isCachingEnabled = !config.get("disable_tenant_caching");
    this.deconstructionFn = deconstructionFn;
  }

  public subscribe() {
    if (this.isCachingEnabled) {
      // Unsubscribe from updates if we
      this.unsubscribe();

      this.unsubscribeFn = this.tenantCache.subscribe(async tenant => {
        // Get the current set value for the item in the cache.
        const value = this.get(tenant.id);

        // Delete the tenant cache item when the tenant changes.
        this.cache.delete(tenant.id);

        if (this.deconstructionFn) {
          // The deconstruction function is set. We will check that the value
          // exists, and if it does, we will call the function with the given
          // identifier, this allows the caller to attach deconstruction
          // components to the tenant being removed. The only side affect to
          // note is that by the time that the deconstruction function is
          // called, the tenant has already been purged from the cache.
          if (typeof value !== "undefined") {
            await this.deconstructionFn(tenant.id, value);
          }
        }
      });
    }
  }

  /**
   * This will disconnect the map/cache from getting updates.
   */
  public unsubscribe() {
    if (this.isCachingEnabled && this.unsubscribeFn) {
      this.unsubscribeFn();
    }
  }

  /**
   * get will return the cached entry keyed on the tenantID.
   *
   * @param tenantID the tenantID for the cached item
   */
  public get(tenantID: string): T | undefined {
    if (this.isCachingEnabled) {
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
  public set(tenantID: string, value: T): TenantCacheAdapter<T> {
    if (this.isCachingEnabled) {
      this.cache.set(tenantID, value);
    }

    return this;
  }
}
