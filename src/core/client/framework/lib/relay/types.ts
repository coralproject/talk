import { _RefType } from "react-relay";

export type FragmentKeys<T> = {
  [P in keyof T]: T[P] extends _RefType<any> | null ? P : never
}[keyof T];

export type FragmentKeysNoLocal<T> = Exclude<FragmentKeys<T>, "local">;
