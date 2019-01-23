import { FormApi } from "final-form";
import { ReactNode } from "react";

type ErrorsObject<T> = { [K in keyof T]?: ReactNode };

/**
 * A version of FormProps["onSubmit"] with support for Generic Types.
 */
export type OnSubmit<T> = (
  values: T,
  form: FormApi
) => ErrorsObject<T> | Promise<ErrorsObject<T> | void> | void;

export const parsePercentage = (v: string) =>
  Math.min(100, Math.max(Number.parseInt(v, 10), 0)) / 100;
export const formatPercentage = (v: number) =>
  v || v === 0 ? Math.round(v * 100).toString() : null;
export const parseStringBool = (v: string) => v === "true";

export const parseNewLineDelimitedString = (v: string) => v.split("\n");
export const formatNewLineDelimitedString = (
  v: ReadonlyArray<string> | undefined | null
) => (v && v.join("\n")) || "";
