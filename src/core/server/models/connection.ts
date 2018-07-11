export type Cursor = Date | number | string | null;

export interface Edge<T> {
  node: T;
  cursor: Cursor;
}

export interface PageInfo {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  startCursor?: Cursor;
  endCursor?: Cursor;
}

export interface Connection<T> {
  edges: Array<Edge<T>>;
  pageInfo: PageInfo;
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
