declare module "webfinger" {
  export interface WebfingerOptions {
    webfingerOnly?: boolean;
  }

  export interface WebfingerCallback {
    (err: Error, jrd: { [key: string]: any }): void;
  }

  export function webfinger(
    resource: string,
    res: string,
    options: WebfingerOptions,
    callback: WebfingerCallback
  ): void;
}
