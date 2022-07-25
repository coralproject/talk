import DOMPurify from "dompurify";
import { FormApi } from "final-form";
import { ReactNode } from "react";
import { FieldRenderProps } from "react-final-form";

type ErrorsObject<T> = { [K in keyof T]?: ReactNode };

/**
 * A version of FormProps["onSubmit"] with support for Generic Types.
 */
export type OnSubmit<T> = (
  values: T,
  form: FormApi
) => ErrorsObject<T> | Promise<ErrorsObject<T> | void> | void;

export interface FormError {
  "FINAL_FORM/form-error": any;
}

export const parseEmptyAsNull = (v: any) => {
  if (v === "") {
    return null;
  }
  return v;
};

export const parseWithDOMPurify: any = (v: any) => {
  if (v === "") {
    return null;
  }
  return DOMPurify.sanitize(v);
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
export const formatBool = (v: boolean) => {
  return v ? "true" : "false";
};

export const parseInteger = (v: any) => {
  const result = Number.parseInt(v, 10);
  if (isNaN(result)) {
    return v;
  }
  return result;
};
export const parseIntegerNullable = (v: string) => {
  if (v.trim() === "") {
    return null;
  }
  return parseInteger(v);
};

export const parseNewLineDelimitedString = (v: string) => v.split("\n");
export const formatNewLineDelimitedString = (
  v: ReadonlyArray<string> | undefined | null
) => (v && v.join("\n")) || "";

export const parseString = (v: string | undefined) => {
  if (!v) {
    return "";
  }
  return v;
};

export const parseStringList = (v: string) => {
  if (v === "") {
    return [];
  }
  return v.split(",").map((x) => x.trim());
};

export const formatStringList = (v: string[] | null) => {
  if (v === null || v === undefined) {
    return "";
  }
  return v.join(", ");
};

export type FieldMeta = Pick<
  FieldRenderProps<any, HTMLElement>["meta"],
  "error" | "submitError" | "submitFailed"
>;

export const hasError = ({ error, submitError, submitFailed }: FieldMeta) =>
  submitFailed && (error || submitError);

export const colorFromMeta = (meta: FieldMeta) =>
  hasError(meta) ? "error" : "regular";

export const streamColorFromMeta = (meta: FieldMeta) =>
  hasError(meta) ? "error" : "streamBlue";
