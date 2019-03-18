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

export const parseEmptyAsNull = (v: any) => {
  if (v === "") {
    return null;
  }
  return v;
};

export const formatEmpty = (v: any) => {
  if (v === null || v === undefined) {
    return "";
  }
  return v;
};

export const parsePercentage = (v: any) => {
  if (v === "") {
    return null;
  }
  if (isNaN(v)) {
    return v;
  }
  return v / 100;
};
export const formatPercentage = (v: any) => {
  if (v === null || v === undefined) {
    return "";
  }
  if (isNaN(v)) {
    return v;
  }
  return Math.round(v * 100).toString();
};

export const parseBool = (v: any) => Boolean(v);
export const parseStringBool = (v: string) => v === "true";

export const parseNewLineDelimitedString = (v: string) => v.split("\n");
export const formatNewLineDelimitedString = (
  v: ReadonlyArray<string> | undefined | null
) => (v && v.join("\n")) || "";

export const parseStringList = (v: string) => {
  if (v === "") {
    return [];
  }
  return v.split(",").map(x => x.trim());
};

export const formatStringList = (v: string[] | null) => {
  if (v === null || v === undefined) {
    return "";
  }
  return v.join(", ");
};
