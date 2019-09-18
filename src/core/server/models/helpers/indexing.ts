import { merge } from "lodash";
import { Collection, IndexOptions } from "mongodb";

import { Writable } from "coral-common/types";
import logger from "coral-server/logger";

type IndexType = 1 | -1 | "text";

export type IndexSpecification<T> = {
  [P in keyof Writable<Partial<T>>]: IndexType
} &
  Record<string, IndexType>;

type IndexCreationFunction<T> = (
  indexSpec: IndexSpecification<T>,
  indexOptions?: IndexOptions
) => Promise<string>;

export function createIndexFactory<T>(
  collection: Collection<T>
): IndexCreationFunction<T> {
  const log = logger.child(
    {
      collectionName: collection.collectionName,
    },
    true
  );

  return async (
    indexSpec: IndexSpecification<T>,
    indexOptions: IndexOptions = {}
  ) => {
    try {
      // Try to create the index.
      const indexName = await collection.createIndex(indexSpec, indexOptions);
      log.debug({ indexName, indexSpec, indexOptions }, "index was created");

      // Match the interface from the `createIndex` function by returning the
      // index name.
      return indexName;
    } catch (err) {
      log.error({ err, indexSpec, indexOptions }, "could not create index");

      // Rethrow the error here.
      throw err;
    }
  };
}

export function createConnectionOrderVariants<T>(
  variants: Array<IndexSpecification<T>>,
  indexOptions: IndexOptions = {}
) {
  return async (
    createIndex: IndexCreationFunction<T>,
    indexSpec: IndexSpecification<T>,
    variantIndexOptions: IndexOptions = {}
  ) => {
    /**
     * createIndexVariant will create a variant on the specified `indexSpec` that
     * will include the new variation.
     *
     * @param variantSpec the spec that makes this variant different
     */
    const createIndexVariant = (variantSpec: IndexSpecification<T>) =>
      createIndex(
        merge({}, indexSpec, variantSpec),
        merge({}, indexOptions, variantIndexOptions)
      );

    // Create a raw index without the variants applied.
    await createIndex(indexSpec, merge({}, indexOptions, variantIndexOptions));

    // Create all the variants.
    for (const variant of variants) {
      await createIndexVariant(variant);
    }
  };
}
