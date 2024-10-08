import DataLoader from "dataloader";
import { EventEmitter } from "events";
import { Redis } from "ioredis";
import { v4 as uuid } from "uuid";

import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import logger from "coral-server/logger";
import {
  countTenants,
  retrieveAllTenants,
  retrieveManyTenants,
  retrieveManyTenantsByDomain,
  Tenant,
} from "coral-server/models/tenant";

import { WithId } from "mongodb";
import { parse, stringify } from "./json";

const TENANT_CACHE_CHANNEL_VERSION = 1;
const TENANT_CACHE_CHANNEL = `TENANT_CACHE_CHANNEL_V${TENANT_CACHE_CHANNEL_VERSION}`;

// eslint-disable-next-line no-shadow
enum EVENTS {
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

type UpdateSubscribeCallback = (tenant: Tenant) => void;
type DeleteSubscribeCallback = (tenantID: string, tenantDomain: string) => void;

type Message = UpdateMessage | DeleteMessage;

interface DeleteMessage {
  event: EVENTS.DELETE;
  tenantID: string;
  tenantDomain: string;
  clientApplicationID: string;
}

interface UpdateMessage {
  event: EVENTS.UPDATE;
  tenant: Tenant;
  clientApplicationID: string;
}

/**
 * MessageData is a type that is used to select only the data parts of the
 * message.
 */
type MessageData<T extends Message> = Omit<T, "clientApplicationID" | "event">;

// TenantCache provides an interface for retrieving tenant stored in local
// memory rather than grabbing it from the database every single call.
export default class TenantCache {
  /**
   * tenantsByID reference the tenants that have been cached/retrieved by ID.
   */
  private readonly tenantsByID: DataLoader<string, Readonly<Tenant> | null>;

  /**
   * tenantsByDomain reference the tenants that have been cached/retrieved by
   * Domain.
   */
  private readonly tenantsByDomain: DataLoader<string, Readonly<Tenant> | null>;

  /**
   * tenantCountCache stores all the id's of all the Tenant's that have crossed
   * it.
   */
  private readonly tenantCountCache = new Set<string>();

  /**
   * primed is true when the cache has already been fully primed.
   */
  private primed = false;

  /**
   * Create a new client application ID. This prevents duplicated messages
   * generated by this application from being handled as external messages
   * as we should have already processed it.
   */
  private readonly clientApplicationID = uuid();

  private readonly redis: Redis;
  private readonly mongo: MongoContext;
  private readonly emitter = new EventEmitter();

  /**
   * cachingEnabled is true when tenant caching has been enabled.
   */
  public readonly cachingEnabled: boolean;

  constructor(mongo: MongoContext, redis: Redis, config: Config) {
    this.cachingEnabled = !config.get("disable_tenant_caching");
    if (!this.cachingEnabled) {
      logger.warn("tenant caching is disabled");
    } else {
      logger.debug("tenant caching is enabled");
    }

    // Save the Db reference.
    this.redis = redis;
    this.mongo = mongo;

    // Configure the data loaders.
    this.tenantsByID = new DataLoader(
      async (ids) => {
        logger.debug({ ids: ids.length }, "now loading tenants");
        const tenants = await retrieveManyTenants(this.mongo, ids);
        logger.debug(
          { tenants: tenants.filter((t) => t !== null).length },
          "loaded tenants"
        );

        tenants
          .filter((t) => t !== null)
          .forEach((t: WithId<Readonly<Tenant>>) =>
            this.tenantCountCache.add(t.id)
          );

        return tenants;
      },
      {
        cache: this.cachingEnabled,
      }
    );

    this.tenantsByDomain = new DataLoader(
      async (domains) => {
        logger.debug({ domains: domains.length }, "now loading tenants");
        const tenants = await retrieveManyTenantsByDomain(this.mongo, domains);
        logger.debug(
          { tenants: tenants.filter((t) => t !== null).length },
          "loaded tenants"
        );

        tenants
          .filter((t) => t !== null)
          .forEach((t: WithId<Readonly<Tenant>>) =>
            this.tenantCountCache.add(t.id)
          );

        return tenants;
      },
      {
        cache: this.cachingEnabled,
      }
    );

    // We don't need updates if we aren't synced to tenant updates.
    if (this.cachingEnabled) {
      // Attach to messages on this connection so we can receive updates when
      // the tenant are changed.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.redis.on("message", this.onMessage.bind(this));
    }
  }

  public async connect() {
    // Subscribe to tenant notifications.
    await this.redis.subscribe(TENANT_CACHE_CHANNEL);
  }

  /**
   * count will return the number of Tenant's.
   */
  public async count(): Promise<number> {
    if (!this.cachingEnabled) {
      return countTenants(this.mongo);
    }

    if (!this.primed) {
      await this.primeAll();
    }

    return this.tenantCountCache.size;
  }

  /**
   * primeAll will load all the tenants into the cache on startup.
   */
  public async primeAll() {
    if (!this.cachingEnabled) {
      logger.debug("tenants not primed, caching disabled");
      return;
    }

    // Grab all the tenants for this node.
    const tenants = await retrieveAllTenants(this.mongo);

    // Clear out all the items in the cache.
    this.tenantsByID.clearAll();
    this.tenantsByDomain.clearAll();
    this.tenantCountCache.clear();

    // Prime the cache with each of these tenants.
    tenants.forEach((tenant) => {
      this.tenantsByID.prime(tenant.id, tenant);
      this.tenantsByDomain.prime(tenant.domain, tenant);
      this.tenantCountCache.add(tenant.id);
    });

    logger.debug({ tenants: tenants.length }, "primed all tenants");
    this.primed = true;
  }

  /**
   * @yields
   * Symbol.asyncIterator implements the asyncIterator interface for the
   * TenantCache. This allows you to use the TenantCache as a asyncIterator with
   * a `for await (const tenant of tenants) {}` pattern to iterate over all the
   * tenant's on the cache. If the cache is cacheable, and not primed, the cache
   * will be primed at the first async iteration process. If caching is
   * disabled, then the tenants will bne loaded on demand and not persisted
   * after the iteration.
   */
  public async *[Symbol.asyncIterator]() {
    // If the cache isn't primed, and caching is enabled, then prime the cache
    // now, as this will increase performance dramatically.
    if (!this.primed && this.cachingEnabled) {
      await this.primeAll();
    }

    // Copy the tenant count cache to prevent race conditions related to
    // clearing during iteration.
    const cache = new Set(this.tenantCountCache);

    // If the tenant's are primed in the cache, then just use the count cache as
    // the iteration source.
    if (this.primed) {
      for (const tenantID of cache) {
        const tenant = await this.tenantsByID.load(tenantID);
        if (!tenant) {
          continue;
        }

        yield tenant;
      }

      return;
    }

    // Caching must be disabled, so just grab all the tenants for this node and
    // iterate through each of them as we handle it.
    const tenants = await retrieveAllTenants(this.mongo);
    for (const tenant of tenants) {
      yield tenant;
    }
  }

  private onUpdateMessage({ tenant }: MessageData<UpdateMessage>) {
    // Update the tenant cache.
    this.tenantsByID.clear(tenant.id).prime(tenant.id, tenant);
    this.tenantsByDomain.clear(tenant.domain).prime(tenant.domain, tenant);
    this.tenantCountCache.add(tenant.id);

    // Publish the event for the connected listeners.
    this.emitter.emit(EVENTS.UPDATE, tenant);
  }

  private onDeleteMessage({
    tenantID,
    tenantDomain,
  }: MessageData<DeleteMessage>) {
    // Delete the tenant in the local cache.
    this.tenantsByID.clear(tenantID);
    this.tenantsByDomain.clear(tenantDomain);
    this.tenantCountCache.delete(tenantID);

    // Publish the event for the connected listeners.
    this.emitter.emit(EVENTS.DELETE, tenantID, tenantDomain);
  }

  /**
   *  onMessage is fired every time the client gets a subscription event.
   */
  private onMessage = async (channel: string, data: string): Promise<void> => {
    // Only do things when the message is for tenant.
    if (channel !== TENANT_CACHE_CHANNEL) {
      return;
    }

    try {
      // Parse the message (which is JSON).
      const message: Message = parse(data);

      // Extract some known parameters.
      const { clientApplicationID } = message;

      // Check to see if this was the update issued by this instance.
      if (clientApplicationID === this.clientApplicationID) {
        // It was, so just return here, we already updated/handled it.
        return;
      }

      const log = logger.child({ eventName: message.event }, true);
      log.debug("received tenant message");

      // Send the message to the correct handler.
      switch (message.event) {
        case EVENTS.UPDATE:
          return this.onUpdateMessage(message);
        case EVENTS.DELETE:
          return this.onDeleteMessage(message);
        default:
          log.warn("received unknown event");
          return;
      }
    } catch (err) {
      logger.error(
        { err },
        "an error occurred while trying to handle a message"
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
   * This allows you to subscribe to new Tenant updates. This will also return
   * a function that when called, unsubscribes you from updates.
   * @param updateCallback the function to be called when there is an updated Tenant.
   * @param deleteCallback the function to be called when a tenant needs to be purged
   */
  public subscribe(
    updateCallback: UpdateSubscribeCallback,
    deleteCallback: DeleteSubscribeCallback
  ) {
    this.emitter.on(EVENTS.UPDATE, updateCallback);
    this.emitter.on(EVENTS.DELETE, deleteCallback);

    // Return the unsubscribe function.
    return () => {
      this.emitter.removeListener(EVENTS.UPDATE, updateCallback);
      this.emitter.removeListener(EVENTS.DELETE, deleteCallback);
    };
  }

  private async publish(tenantID: string, conn: Redis, message: Message) {
    const subscribers = await conn.publish(
      TENANT_CACHE_CHANNEL,
      stringify(message)
    );
    logger.debug(
      { tenantID, subscribers, eventName: message.event },
      "updated tenant in cache"
    );
  }

  /**
   * update will update the value for Tenant in the local cache and publish
   * a change notification that will be used to keep the other nodes in sync.
   * @param conn a redis connection used to publish the change notification
   * @param tenant the updated Tenant object
   */
  public async update(conn: Redis, tenant: Tenant): Promise<void> {
    // Process the tenant update on this node.
    this.onUpdateMessage({ tenant });

    // Notify the other nodes about the tenant change.
    await this.publish(tenant.id, conn, {
      event: EVENTS.UPDATE,
      tenant,
      clientApplicationID: this.clientApplicationID,
    });
  }

  public async delete(conn: Redis, tenantID: string, tenantDomain: string) {
    // Process the tenant update on this node.
    this.onDeleteMessage({ tenantID, tenantDomain });

    // Notify the other nodes about the tenant change.
    await this.publish(tenantID, conn, {
      event: EVENTS.DELETE,
      tenantID,
      tenantDomain,
      clientApplicationID: this.clientApplicationID,
    });
  }
}
