import { merge } from "lodash";

import Query, { FilterQuery } from "./query";

export type Cursor = Date | number | string | null;

export interface Edge<T> {
  node: T;
  cursor: Cursor;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: Cursor;
  endCursor?: Cursor;
}

export interface Connection<T> {
  edges: Array<Edge<T>>;
  nodes: T[];
  pageInfo: PageInfo;
}

export interface ConnectionInput<T> {
  /**
   * first is the number of items to load for the connection. The returned
   * amount of items may be less.
   */
  first: number;

  /**
   * after is an optional cursor that can be used to paginate the result set.
   */
  after?: Cursor;

  /**
   * filter is an optional query that can be used to constrain the result set.
   */
  filter?: FilterQuery<T>;
}

export interface OrderedConnectionInput<T, U> extends ConnectionInput<T> {
  /**
   * orderBy allows ordering of the returned connection.
   */
  orderBy: U;
}

/**
 * createConnection will create a base Connection that can be used to satisfy
 * the Connection<T> interface.
 *
 * @param connection the base connection to optionally merge with the default base
 * connection details.
 */
export function createConnection<T>(
  connection: Partial<Connection<T>> = {}
): Connection<T> {
  return merge(
    {
      edges: [],
      nodes: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
    connection
  );
}

export interface PaginationArgs {
  first: number;
}

export function getPageInfo<T>(args: PaginationArgs, edges: Array<Edge<T>>) {
  const pageInfo: PageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  };

  if (edges.length === 0) {
    // If there are no edges, then there's nothing to paginate!
    return pageInfo;
  }

  // The hasNextPage is always handled the same (ask for one more than we need,
  // if there is one more, than there is more).
  if (args.first >= 0 && edges.length > args.first) {
    // There was one more than we expected! Set hasNextPage = true.
    pageInfo.hasNextPage = true;
  }

  if (pageInfo.hasNextPage && edges.length > 1) {
    // There was more than one expected, and there is two entries in the edges
    // array. We should grab the second last one because the last one will have
    // to be trimmed off after.
    pageInfo.endCursor = edges[edges.length - 2].cursor;
  } else {
    // There was not more than expected, so we should just grab the last edge to
    // get the endCursor.
    pageInfo.endCursor = edges[edges.length - 1].cursor;
  }

  return pageInfo;
}

export type NodeToCursorTransformer<T> = (node: T, index: number) => Cursor;

export function nodesToEdges<T>(
  nodes: T[],
  transformer: NodeToCursorTransformer<T>
): Array<Edge<T>> {
  return nodes.map((node, index) => ({
    node,
    cursor: transformer(node, index),
  }));
}

export function doesNotContainNull<T>(items: Array<T | null>): items is T[] {
  return items.every((item) => Boolean(item));
}

/**
 * resolveConnection will transform a query, pagination args into a full typed
 * connection. This will add `1` to the length of elements being retrieved to
 * determine if there is another page of results to be loaded. The additional
 * node requested will be trimmed from the connection output.
 *
 * @param query the query to use when retrieving the documents.
 * @param input the pagination arguments
 * @param transformer the node transformer which converts a node to a custor
 */
export async function resolveConnection<T>(
  query: Query<T>,
  input: PaginationArgs,
  transformer: NodeToCursorTransformer<T>
) {
  // We load one more than the limit so we can determine if there is another
  // page of entries. This gets trimmed off below after we've checked to see if
  // this constitutes another page of edges.
  query.first(input.first + 1);

  // Get the nodes.
  const nodes = await query.exec().then((cursor) => cursor.toArray());

  // Convert the nodes to edges (which will include the extra edge we don't need
  // if there is more results).
  const edges = nodesToEdges(nodes, transformer);

  // Get the pageInfo for the connection. We will use this to also determine if
  // we need to trim off the extra edge that we requested by comparing its
  // hasNextPage parameter.
  const pageInfo = getPageInfo(input, edges);
  if (pageInfo.hasNextPage) {
    // Because this means that we got one more than expected, we should trim off
    // the extra edge that was retrieved.
    edges.splice(input.first, 1);
    nodes.splice(input.first, 1);
  }

  // Return the connection.
  return {
    edges,
    nodes,
    pageInfo,
  };
}

export function createEmptyConnection<T>() {
  const edges: Edge<T>[] = [];
  const nodes: T[] = [];

  const pageInfo: PageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  };

  return {
    edges,
    nodes,
    pageInfo,
  };
}
