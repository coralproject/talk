import { _RefType } from "react-relay";

export type FragmentKeys<T> = Exclude<
  {
    [P in keyof T]: T[P] extends _RefType<any> | null ? P : never;
  }[keyof T],
  undefined
>;

export type FragmentKeysNoLocal<T> = Exclude<FragmentKeys<T>, "local">;
