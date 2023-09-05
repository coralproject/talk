import { VerifyOptions, VerifyCallback } from "jsonwebtoken";

declare module "jsonwebtoken" {
  export type KeyFunctionCallback = (
    err: Error | null,
    secretOrPublicKey?: string | Buffer
  ) => void;
  export type KeyFunction = (
    headers: { kid?: string },
    callback: KeyFunctionCallback
  ) => void;

  export function verify(
    token: string,
    secretOrPublicKey: string | Buffer | KeyFunction,
    options?: VerifyOptions,
    callback?: VerifyCallback
  ): object | string;
}
