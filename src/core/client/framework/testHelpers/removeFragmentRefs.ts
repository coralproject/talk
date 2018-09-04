import { ComponentType } from "react";

/** Remove all traces of `$fragmentRefs` and `$refType` from type recursively */
export type NoFragmentRefs<T> = T extends object
  ? {
      [P in Exclude<keyof T, " $fragmentRefs" | " $refType">]: NoFragmentRefs<
        T[P]
      >
    }
  : T;

export default function removeFragmentRefs<T>(
  component: ComponentType<T>
): ComponentType<NoFragmentRefs<T>> {
  return component as any;
}
