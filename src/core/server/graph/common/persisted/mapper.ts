import { PersistedQueryNotFound } from "coral-server/errors";
import { PersistedQuery } from "coral-server/models/queries";

interface Payload {
  id?: string;
  query?: string;
}

interface Cache {
  get(id: string): Promise<PersistedQuery | null>;
}

/**
 * getPersistedQuery will try to get the persisted query referenced by the
 * payload and return it if one exists. If a persisted query is referenced, but
 * non is available, it will throw an error.
 *
 * @param cache the cache to pull the query from
 * @param payload the payload that references the query that should be read
 */
export async function getPersistedQuery(
  cache: Cache,
  payload?: Readonly<Payload>
) {
  if (
    !payload ||
    !payload.id ||
    // Persisted queries can either have a query set to `PERSISTED_QUERY` or is
    // empty.
    !(payload.query === "PERSISTED_QUERY" || payload.query === "")
  ) {
    return undefined;
  }

  const query = await cache.get(payload.id);
  if (!query) {
    throw new PersistedQueryNotFound(payload.id);
  }

  return query;
}
