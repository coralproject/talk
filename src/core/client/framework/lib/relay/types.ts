import { _RefType } from "react-relay";

import { UnpackReadonlyArray } from "coral-common/types";

export type FragmentKeys<T> = Exclude<
  {
    [P in keyof T]: UnpackReadonlyArray<T[P]> extends _RefType<any> | null
      ? P
      : never;
  }[keyof T],
  undefined
>;

export type FragmentKeysNoLocal<T> = Exclude<FragmentKeys<T>, "local">;
