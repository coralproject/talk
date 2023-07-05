import { ComponentType } from "react";

/** Remove `$fragmentRefs` and `$refType` on a single object */
export type OmitFragments<T> = Pick<
  T,
  {
    [P in keyof T]: P extends " $fragmentRefs" | " $refType" ? never : P;
  }[keyof T]
>;

export type NoFragmentRefs<T> = T extends object
  ? T extends (...args: any[]) => any
    ? T
    : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<NoFragmentRefs2<U>> // TODO: (cvle) this should normally reference itself but it complains about a circular reference.
    : { [P in keyof OmitFragments<T>]: NoFragmentRefs<T[P]> }
  : T;

// TODO: (cvle) these NoFragmentRefX are a workaround for above issue
export type NoFragmentRefs2<T> = T extends object
  ? T extends (...args: any[]) => any
    ? T
    : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<NoFragmentRefs3<U>>
    : { [P in keyof OmitFragments<T>]: NoFragmentRefs<T[P]> }
  : T;

export type NoFragmentRefs3<T> = T extends object
  ? T extends (...args: any[]) => any
    ? T
    : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<NoFragmentRefs4<U>>
    : { [P in keyof OmitFragments<T>]: NoFragmentRefs<T[P]> }
  : T;

export type NoFragmentRefs4<T> = T extends object
  ? T extends (...args: any[]) => any
    ? T
    : { [P in keyof OmitFragments<T>]: NoFragmentRefs<T[P]> }
  : T;

export default function removeFragmentRefs<T>(
  component: ComponentType<T>
): ComponentType<NoFragmentRefs<T>> {
  return component as any;
}
