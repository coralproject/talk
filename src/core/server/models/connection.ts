export type Cursor = Date | number | string;

export interface Edge<T> {
    node: T;
    cursor: Cursor;
}

export interface PageInfo {
    hasNextPage: boolean;
}

export interface Connection<T> {
    edges: Edge<T>[];
    pageInfo: PageInfo;
}
