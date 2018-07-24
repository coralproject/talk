import DataLoader from "dataloader";
import { Redis } from "ioredis";
import { Db } from "mongodb";

import logger from "talk-server/logger";
import {
  retrieveAllTenants,
  retrieveManyTenants,
  retrieveManyTenantsByDomain,
  Tenant,
} from "talk-server/models/tenant";

const CacheUpdateChannel = "tenant";

// TenantCache provides an interface for retrieving tenant stored in local
// memory rather than grabbing it from the database every single call.
export default class TenantCache {
  private tenantsByID: DataLoader<string, Readonly<Tenant> | null>;
  private tenantsByDomain: DataLoader<string, Readonly<Tenant> | null>;
  private mongo: Db;

  constructor(mongo: Db, subscriber: Redis) {
    // Save the Db reference.
    this.mongo = mongo;

    // Prepare the list of all tenant's maintained by this instance.
    this.tenantsByID = new DataLoader(ids => retrieveManyTenants(mongo, ids));
    this.tenantsByDomain = new DataLoader(domains =>
      retrieveManyTenantsByDomain(mongo, domains)
    );

    // Subscribe to tenant notifications.
    subscriber.subscribe(CacheUpdateChannel);

    // Attach to messages on this connection so we can receive updates when
    // the tenant are changed.
    subscriber.on("message", this.onMessage);
  }

  /**
   * primeAll will load all the tenants into the cache on startup.
   */
  public async primeAll() {
    // Grab all the tenants for this node.
    const tenants = await retrieveAllTenants(this.mongo);

    // Clear out all the items in the cache.
    this.tenantsByID.clearAll();

    // Prime the cache with each of these tenants.
    tenants.forEach(tenant => {
      this.tenantsByID.prime(tenant.id, tenant);
      this.tenantsByDomain.prime(tenant.domain, tenant);
    });
  }

  /**
   *  onMessage is fired every time the client gets a subscription event.
   */
  private onMessage = async (
    channel: string,
    message: string
  ): Promise<void> => {
    // Only do things when the message is for tenant.
    if (channel !== CacheUpdateChannel) {
      return;
    }

    logger.debug("recieved updated tenant");

    try {
      // Updated tenant come from the messages.
      const tenant: Tenant = JSON.parse(message);

      // Update the tenant cache.
      this.tenantsByID.clear(tenant.id).prime(tenant.id, tenant);
      this.tenantsByDomain.clear(tenant.domain).prime(tenant.domain, tenant);
    } catch (err) {
      logger.error(
        { err },
        "an error occued while trying to parse/prime the tenant/tenant cache"
      );
    }
  };

  public async retrieveByID(id: string): Promise<Readonly<Tenant> | null> {
    return this.tenantsByID.load(id);
  }

  public async retrieveByDomain(
    domain: string
  ): Promise<Readonly<Tenant> | null> {
    return this.tenantsByDomain.load(domain);
  }

  /**
   * update will update the value for Tenant in the local cache and publish
   * a change notification that will be used to keep the other nodes in sync.
   *
   * @param conn a redis connection used to publish the change notification
   * @param tenant the updated Tenant object
   */
  public async update(conn: Redis, tenant: Tenant): Promise<void> {
    // Update the tenant in the local cache.
    this.tenantsByID.clear(tenant.id).prime(tenant.id, tenant);
    this.tenantsByDomain.clear(tenant.domain).prime(tenant.domain, tenant);

    // Notify the other nodes about the tenant change.
    await conn.publish(CacheUpdateChannel, JSON.stringify(tenant));
  }
}
