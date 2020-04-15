import { merge } from "lodash";
import { Collection, Db, IndexOptions } from "mongodb";

import { Writable } from "coral-common/types";
import { createTimer } from "coral-server/helpers";
import logger from "coral-server/logger";

import collections from "../mongodb/collections";

type IndexType = 1 | -1 | "text";

export type IndexSpecification<T> = {
  [P in keyof Writable<Partial<T>>]: IndexType;
} &
  Record<string, IndexType>;

type IndexCreationFunction<T> = (
  indexSpec: IndexSpecification<T>,
  indexOptions?: IndexOptions
) => Promise<string>;

export async function createIndex<T>(
  collection: Collection<T>,
  indexSpec: IndexSpecification<T>,
  indexOptions: IndexOptions = {}
) {
  const log = logger.child(
    {
      collectionName: collection.collectionName,
    },
    true
  );

  try {
    // Try to create the index.
    const timer = createTimer();
    log.debug({ indexSpec, indexOptions }, "creating index");
    const indexName = await collection.createIndex(indexSpec, indexOptions);
    log.debug(
      { indexName, indexSpec, indexOptions, took: timer() },
      "index was created"
    );

    // Match the interface from the `createIndex` function by returning the
    // index name.
    return indexName;
  } catch (err) {
    log.error({ err, indexSpec, indexOptions }, "could not create index");

    // Rethrow the error here.
    throw err;
  }
}

export function createIndexFactory<T>(
  collection: Collection<T>
): IndexCreationFunction<T> {
  return async (
    indexSpec: IndexSpecification<T>,
    indexOptions: IndexOptions = {}
  ) => createIndex(collection, indexSpec, indexOptions);
}

export function createConnectionOrderVariants<T>(
  createIndexFn: IndexCreationFunction<T>,
  variants: Array<IndexSpecification<T>>
) {
  return async (indexSpec: IndexSpecification<T>) => {
    /**
     * createIndexVariant will create a variant on the specified `indexSpec` that
     * will include the new variation.
     *
     * @param variantSpec the spec that makes this variant different
     */
    const createIndexVariant = (variantSpec: IndexSpecification<T>) =>
      createIndexFn(merge({}, indexSpec, variantSpec), { background: true });

    // Create all the variants.
    for (const variant of variants) {
      await createIndexVariant(variant);
    }
  };
}

export const createIndexesFactory = (mongo: Db) => ({
  users: createIndexFactory(collections.users(mongo)),
  invites: createIndexFactory(collections.invites(mongo)),
  tenants: createIndexFactory(collections.tenants(mongo)),
  comments: createIndexFactory(collections.comments(mongo)),
  stories: createIndexFactory(collections.stories(mongo)),
  commentActions: createIndexFactory(collections.commentActions(mongo)),
  commentModerationActions: createIndexFactory(
    collections.commentModerationActions(mongo)
  ),
  queries: createIndexFactory(collections.queries(mongo)),
  migrations: createIndexFactory(collections.migrations(mongo)),
  sites: createIndexFactory(collections.sites(mongo)),
});
