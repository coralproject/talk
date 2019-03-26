// TODO: (@cvle) Extract useful common types into its own package.
export { Omit, Overwrite, PropTypesOf } from "talk-ui/types";
export { DeepPartial } from "talk-common/types";

export type RelayEnumLiteral<T> = keyof T | "%future added value";
