export type Cursor = Date | number | string | null;

export interface Edge<T> {
  node: T;
  cursor: Cursor;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: Cursor;
}

export interface Connection<T> {
  edges: Array<Edge<T>>;
  pageInfo: PageInfo;
}
