import React from "react";

// TODO: Extract useful common types into its own package.

/**
 * Overwrite properties of `T`.
 *
 * E.g. Omit<{a: boolean, b: boolean}, "b"> = {a: boolean}
 */
export type Omit<U, K extends keyof U> = Pick<U, Exclude<keyof U, K>>;

/**
 * Overwrite properties of `T`.
 *
 * E.g. Overwrite<{a: boolean}, {a: string}> = {a: string}
 */
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

/**
 * Returns the PropTypes from a React Component.
 *
 * E.g. type ButtonProps = ReturnPropTypes<Button>;
 */
export type PropTypesOf<T> = T extends React.ComponentType<infer R>
  ? R
  : T extends React.Component<infer S> ? S : {};

/**
 * Like Partial but applies it deeply.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer V>
      ? ReadonlyArray<DeepPartial<V>>
      : DeepPartial<T[P]>
};
