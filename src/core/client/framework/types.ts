// TODO: (@cvle) Extract useful common types into its own package.
export { Omit, Overwrite, PropTypesOf } from "coral-ui/types";
export { DeepPartial } from "coral-common/types";

export type RelayEnumLiteral<T> = keyof T | "%future added value";
