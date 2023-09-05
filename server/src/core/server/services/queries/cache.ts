import DataLoader from "dataloader";
import LRU from "lru-cache";

import { MongoContext } from "coral-server/data/context";
import { loadPersistedQueries } from "coral-server/graph/persisted";
import logger from "coral-server/logger";
import {
  getQueries,
  PersistedQuery,
  primeQueries,
} from "coral-server/models/queries/queries";

interface PersistedQueryCacheOptions {
  mongo: MongoContext;
}

/**
 * PersistedQueryCache abstracts the persisted query management.
 */
export class PersistedQueryCache {
  private mongo: MongoContext;
  private queries: Map<string, PersistedQuery>;
  private cache: LRU<string, PersistedQuery>;
  private loader: DataLoader<string, PersistedQuery | null>;

  constructor(options: PersistedQueryCacheOptions) {
    const queries = loadPersistedQueries();

    this.mongo = options.mongo;
    this.loader = new DataLoader(
      (ids: string[]) => getQueries(this.mongo, ids),
      {
        // Turn off caching as we're using the LRU cache here instead.
        cache: false,
      }
    );
    this.queries = new Map();
    this.cache = new LRU({
      // We'll only retain the amount of queries we have right now so we could
      // possibly hold the previous version in memory if need be. Ideally, we'll
      // always have the keys we need in memory.
      max: queries.length,
      dispose: (id, query) => {
        logger.warn(
          { queryID: id, queryVersion: query.version },
          "cache full, dropping query from cache"
        );
      },
    });

    // Insert all the queries into the local query cache.
    for (const query of queries) {
      this.queries.set(query.id, query);
    }
  }

  public get size() {
    return this.queries.size + this.cache.length;
  }

  /**
   * prime will load the local queries into the database so every time that the
   * server starts, the queries will be available to other instances.
   */
  public async prime() {
    if (this.queries.size === 0) {
      return;
    }

    const queries: PersistedQuery[] = [];
    for (const query of this.queries.values()) {
      queries.push(query);
    }

    logger.debug({ queries: queries.length }, "priming queries");

    await primeQueries(this.mongo, queries);
  }

  /**
   * get will retrieve a given PersistedQuery by ID.
   *
   * @param id the ID of the persisted query to load
   */
  public async get(id: string) {
    // Try to get the query from the local query cache.
    let query: PersistedQuery | null | undefined = this.queries.get(id);
    if (query) {
      return query;
    }

    // Try to get the query from the remote cache.
    query = this.cache.get(id);
    if (query) {
      return query;
    }

    // Try to get the query from the loader.
    query = await this.loader.load(id);
    if (query) {
      logger.warn(
        { queryID: id, queryVersion: query.version },
        "query did not exist in cache, retrieved from MongoDB"
      );

      // Cache this query in the memory cache.
      this.cache.set(query.id, query);
      return query;
    }

    logger.warn({ queryID: id }, "query did not exist in cache or MongoDB");

    return null;
  }
}
