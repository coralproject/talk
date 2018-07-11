import React from "react";

// TODO: Extract useful common types into its own package.

/**
 * Returns literals types that are in T but not in U.
 *
 * E.g. Diff<"a" | "b", "a"> = "b"
 */
export type Diff<T extends keyof any, U extends keyof any> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never; [x: number]: never })[T];

/**
 * Overwrite properties of `T`.
 *
 * E.g. Omit<{a: boolean, b: boolean}, "b"> = {a: boolean}
 */
export type Omit<U, K extends keyof U> = Pick<U, Diff<keyof U, K>>;

/**
 * Overwrite properties of `T`.
 *
 * E.g. Overwrite<{a: boolean}, {a: string}> = {a: string}
 */
export type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U;

/**
 * Returns the PropTypes from a React Component.
 *
 * E.g. type ButtonProps = ReturnPropTypes<Button>;
 */
export type PropTypesOf<T> = T extends React.ComponentType<infer R>
  ? R
  : T extends React.Component<infer S> ? S : {};
