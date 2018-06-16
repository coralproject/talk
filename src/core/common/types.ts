export type Diff<T extends keyof any, U extends keyof any> = ({ [P in T]: P } &
    { [P in U]: never } & { [x: string]: never })[T];

export type Omit<U, K extends keyof U> = Pick<U, Diff<keyof U, K>>;

export type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U;

export type Sub<T, U> = Pick<T, Diff<keyof T, keyof U>>;

/**
 * Make all properties in T writeable
 */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
