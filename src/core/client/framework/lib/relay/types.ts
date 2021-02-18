import { _RefType } from "react-relay";

type UnpackReadonlyArray<T> = T extends ReadonlyArray<infer U> ? U : T;

export type FragmentKeys<T> = Exclude<
  {
    [P in keyof T]: UnpackReadonlyArray<T[P]> extends _RefType<any> | null
      ? P
      : never;
  }[keyof T],
  undefined
>;

export type FragmentKeysNoLocal<T> = Exclude<FragmentKeys<T>, "local">;
