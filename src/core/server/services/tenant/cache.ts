import { Db } from "mongodb";
import { Redis } from "ioredis";
import DataLoader from "dataloader";

import { Tenant, retrieveAll, retrieveMany } from "talk-server/models/tenant";

const CacheUpdateChannel = "tenant";

// Cache provides an interface for retrieving tenant stored in local memory
// rather than grabbing it from the database every single call.
export default class Cache {
  // private tenants: Map<string, Promise<Readonly<Tenant>>>;
  private tenants: DataLoader<string, Readonly<Tenant>>;
  private db: Db;

  constructor(db: Db, subscriber: Redis) {
    // Save the Db reference.
    this.db = db;

    // Prepare the list of all tenant's maintained by this instance.
    this.tenants = new DataLoader(ids => retrieveMany(db, ids));

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
    const tenants = await retrieveAll(this.db);

    // Clear out all the items in the cache.
    this.tenants.clearAll();

    // Prime the cache with each of these tenants.
    tenants.forEach(tenant => this.tenants.prime(tenant.id, tenant));
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

    try {
      // Updated tenant come from the messages.
      const tenant: Tenant = JSON.parse(message);

      // Update the tenant cache.
      this.tenants.clear(tenant.id).prime(tenant.id, tenant);
    } catch (err) {
      // FIXME: handle the error
    }
  };

  /**
   * retrieve returns a promise that will resolve to the tenant for Talk.
   */
  public async retrieve(id: string): Promise<Readonly<Tenant>> {
    return this.tenants.load(id);
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
    this.tenants.clear(tenant.id).prime(tenant.id, tenant);

    // Notify the other nodes about the tenant change.
    await conn.publish(CacheUpdateChannel, JSON.stringify(tenant));
  }
}
