import { isUndefined, omitBy } from "lodash";
import { Collection, Cursor, FilterQuery as MongoFilterQuery } from "mongodb";

import { Writable } from "coral-common/types";
import logger from "coral-server/logger";

/**
 * FilterQuery<T> ensures that given the type T, that the FilterQuery will be a
 * Writable, partial set of properties while also including MongoDB specific
 * properties (like $lt, or $gte).
 */
export type FilterQuery<T> = MongoFilterQuery<Writable<Partial<T>>>;

/**
 * Query is a convenience class used to wrap the existing MongoDB driver to
 * provide easier complex query management.
 */
export default class Query<T> {
  public filter: FilterQuery<T>;
  public projection: FilterQuery<T>;

  private collection: Collection<T>;
  private skip?: number;
  private limit?: number;
  private sort?: object;

  constructor(collection: Collection<T>) {
    this.collection = collection;
    this.filter = {};
  }

  /**
   * where will merge the given filter into the existing query.
   *
   * @param filter the filter to merge into the existing query
   */
  public where(filter: FilterQuery<T>): Query<T> {
    this.filter = { ...this.filter, ...omitBy(filter, isUndefined) };
    return this;
  }

  public project(projection: FilterQuery<T>): Query<T> {
    this.projection = projection;
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
    this.sort = { ...this.sort, ...sort };
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

    let cursor = this.collection.find(this.filter);

    if (this.projection) {
      cursor = cursor.project(this.projection);
    }

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
