// TODO: (@cvle) Extract useful common types into its own package.
export { Overwrite, PropTypesOf } from "coral-ui/types";
export { DeepPartial } from "coral-common/types";

export type OmitRefType<T> = Omit<T, " $refType">;
