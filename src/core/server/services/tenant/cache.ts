import DataLoader from "dataloader";
import { Redis } from "ioredis";
import { Db } from "mongodb";
import uuid from "uuid";

import logger from "talk-server/logger";
import {
  retrieveAllTenants,
  retrieveManyTenants,
  retrieveManyTenantsByDomain,
  Tenant,
} from "talk-server/models/tenant";

const TenantUpdateChannel = "tenant";

interface TenantUpdateMessage {
  tenant: Tenant;
  clientApplicationID: string;
}

// TenantCache provides an interface for retrieving tenant stored in local
// memory rather than grabbing it from the database every single call.
export default class TenantCache {
  private tenantsByID: DataLoader<string, Readonly<Tenant> | null>;
  private tenantsByDomain: DataLoader<string, Readonly<Tenant> | null>;
  private mongo: Db;
  private clientApplicationID: string;

  constructor(mongo: Db, subscriber: Redis) {
    // Save the Db reference.
    this.mongo = mongo;

    // Create a new client application ID.
    this.clientApplicationID = uuid.v4();

    // Prepare the list of all tenant's maintained by this instance.
    this.tenantsByID = new DataLoader(ids => {
      logger.debug({ ids: ids.length }, "now loading tenants");
      return retrieveManyTenants(mongo, ids);
    });
    this.tenantsByDomain = new DataLoader(domains => {
      logger.debug({ domains: domains.length }, "now loading tenants");
      return retrieveManyTenantsByDomain(mongo, domains);
    });

    // Subscribe to tenant notifications.
    subscriber.subscribe(TenantUpdateChannel);

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
    this.tenantsByDomain.clearAll();

    // Prime the cache with each of these tenants.
    tenants.forEach(tenant => {
      this.tenantsByID.prime(tenant.id, tenant);
      this.tenantsByDomain.prime(tenant.domain, tenant);
    });

    logger.debug({ tenants: tenants.length }, "primed tenants");
  }

  /**
   *  onMessage is fired every time the client gets a subscription event.
   */
  private onMessage = async (
    channel: string,
    message: string
  ): Promise<void> => {
    // Only do things when the message is for tenant.
    if (channel !== TenantUpdateChannel) {
      return;
    }

    try {
      // Updated tenant come from the messages.
      const { tenant, clientApplicationID }: TenantUpdateMessage = JSON.parse(
        message
      );

      // Check to see if this was the update issued by this instance.
      if (clientApplicationID === this.clientApplicationID) {
        // It was, so just return here, we already updated/handled it.
        return;
      }

      logger.debug({ tenant_id: tenant.id }, "recieved updated tenant");

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
    const message: TenantUpdateMessage = {
      tenant,
      clientApplicationID: this.clientApplicationID,
    };
    await conn.publish(TenantUpdateChannel, JSON.stringify(message));

    logger.debug({ tenant_id: tenant.id }, "updated tenant");
  }
}
