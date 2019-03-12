import { isUndefined, merge, omitBy } from "lodash";

import {
  Collection,
  Cursor,
  FilterQuery as MongoFilterQuery,
  IndexOptions,
} from "mongodb";

import { Writeable } from "talk-common/types";
import logger from "talk-server/logger";

/**
 * FilterQuery<T> ensures that given the type T, that the FilterQuery will be a
 * writeable, partial set of properties while also including MongoDB specific
 * properties (like $lt, or $gte).
 */
export type FilterQuery<T> = MongoFilterQuery<Writeable<Partial<T>>>;

/**
 * Query is a convenience class used to wrap the existing MongoDB driver to
 * provide easier complex query management.
 */
export default class Query<T> {
  public filter: FilterQuery<T>;

  private collection: Collection<T>;
  private skip?: number;
  private limit?: number;
  private sort?: object;

  constructor(collection: Collection<T>) {
    this.collection = collection;
  }

  /**
   * where will merge the given filter into the existing query.
   *
   * @param filter the filter to merge into the existing query
   */
  public where(filter: FilterQuery<T>): Query<T> {
    this.filter = merge({}, this.filter || {}, omitBy(filter, isUndefined));
    return this;
  }

  /**
   * after will skip the indicated number of documents.
   *
   * @param skip the number of documents to skip
   */
  public after(skip: number): Query<T> {
    this.skip = skip;
    return this;
  }

  /**
   * first will limit to the indicated number of documents.
   *
   * @param limit the number of documents to limit the result to
   */
  public first(limit: number): Query<T> {
    this.limit = limit;
    return this;
  }

  /**
   * orderBy will apply sorting to the query filter when executed.
   *
   * @param sort the sorting option for the documents
   */
  public orderBy(sort: object): Query<T> {
    this.sort = merge({}, this.sort || {}, sort);
    return this;
  }

  /**
   * exec will return a cursor to the query.
   */
  public async exec(): Promise<Cursor<T>> {
    logger.trace(
      {
        collection: this.collection.collectionName,
        filter: this.filter,
        limit: this.limit,
        sort: this.sort,
        skip: this.skip,
      },
      "executing query"
    );

    let cursor = await this.collection.find(this.filter);

    if (this.limit) {
      // Apply a limit if it exists.
      cursor = cursor.limit(this.limit);
    }

    if (this.sort) {
      // Apply a sort if it exists.
      cursor = cursor.sort(this.sort);
    }

    if (this.skip) {
      // Apply a skip if it exists.
      cursor = cursor.skip(this.skip);
    }

    return cursor;
  }
}

type IndexType = 1 | -1;

export type IndexSpecification<T> = {
  [P in keyof Writeable<Partial<T>>]: IndexType
} &
  Record<string, IndexType>;

type IndexCreationFunction<T> = (
  indexSpec: IndexSpecification<T>,
  indexOptions?: IndexOptions
) => Promise<string>;

export function createIndexFactory<T>(
  collection: Collection<T>
): IndexCreationFunction<T> {
  const log = logger.child({
    collectionName: collection.collectionName,
  });

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
  variants: Array<IndexSpecification<T>>
) {
  return async (
    createIndex: IndexCreationFunction<T>,
    indexSpec: IndexSpecification<T>
  ) => {
    /**
     * createIndexVariant will create a variant on the specified `indexSpec` that
     * will include the new variation.
     *
     * @param variantSpec the spec that makes this variant different
     */
    const createIndexVariant = (variantSpec: IndexSpecification<T>) =>
      createIndex(merge({}, indexSpec, variantSpec));

    // Create a raw index without the variants applied.
    await createIndex(indexSpec);

    // Create all the variants.
    for (const variant of variants) {
      await createIndexVariant(variant);
    }
  };
}
