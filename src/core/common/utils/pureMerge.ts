import { isArray, mergeWith } from "lodash";

import { DeepPartial } from "talk-common/types";

function mergeCopyArrays(objValue: any, srcValue: any) {
  if (isArray(objValue)) {
    return srcValue;
  }
}

export default function pureMerge<TSource1, TSource2>(
  source1: TSource1,
  source2: TSource2
): TSource1 & TSource2;

export default function pureMerge<TSource1, TSource2, TSource3>(
  source1: TSource1,
  source2: TSource2,
  source3: TSource3
): TSource1 & TSource2 & TSource3;

export default function pureMerge<TSource1, TSource2, TSource3, TSource4>(
  source1: TSource1,
  source2: TSource2,
  source3: TSource3,
  source4: TSource4
): TSource1 & TSource2 & TSource3 & TSource4;

export default function pureMerge<T>(
  source: T,
  ...partials: Array<DeepPartial<T>>
): T;

/**
 * pureMerge merges given sources into one and returns it
 * as a new object without modifiyng existing ones.
 *
 * You can pass a single type e.g. `pureMerge<MyType>()` then
 * the first argument must match the type fully while the other
 * should match it partially.
 *
 * You can also pass types for each of the arguments.
 */
export default function pureMerge(...sources: any[]) {
  return mergeWith({}, ...sources, mergeCopyArrays);
}
