/* tslint:disable */

declare module "react-relay-network-modern/es" {
  // TODO: missing typescript types.
  // import { QueryResponseCache } from 'relay-runtime';

  export interface Variables {
    [name: string]: any;
  }

  export interface FetchOpts {
    url?: string;
    method: "POST" | "GET";
    headers: { [name: string]: string };
    body: string | FormData;
    // Avaliable request modes in fetch options. For details see https://fetch.spec.whatwg.org/#requests
    credentials?: "same-origin" | "include" | "omit";
    mode?: "cors" | "websocket" | "navigate" | "no-cors" | "same-origin";
    cache?:
      | "default"
      | "no-store"
      | "reload"
      | "no-cache"
      | "force-cache"
      | "only-if-cached";
    redirect?: "follow" | "error" | "manual";
    [name: string]: any;
  }

  export interface ConcreteBatch {
    kind: "Batch";
    fragment: any;
    id?: string | null;
    metadata: { [key: string]: any };
    name: string;
    query: any;
    text?: string | null;
  }

  export interface CacheConfig {
    force?: boolean | null;
    poll?: number | null;
    rerunParamExperimental?: any;
  }

  export type FetchResponse = Response;

  export type Uploadable = File | Blob;
  export interface UploadableMap {
    [key: string]: Uploadable;
  }

  export class RelayRequest {
    public static lastGenId: number;
    public id: string;
    public fetchOpts: FetchOpts;

    public operation: ConcreteBatch;
    public variables: Variables;
    public cacheConfig: CacheConfig;
    public uploadables?: UploadableMap | null;

    public getBody(): string | FormData;
    public prepareBody(): string | FormData;
    public getID(): string;
    public getQueryString(): string;
    public getVariables(): Variables;
    public isMutation(): boolean;
    public isFormData(): boolean;
    public clone(): RelayRequest;
  }

  export class RelayResponse {
    public data?: PayloadData | null;
    public errors?: any[] | null;

    public ok: any;
    public status: number;
    public statusText?: string | null;
    public headers?: { [name: string]: string } | null;
    public url?: string | null;
    public text?: string | null;
    public json: any;

    public static createFromFetch(res: FetchResponse): Promise<RelayResponse>;
    public static createFromGraphQL(res: {
      errors?: any;
      data?: any;
    }): Promise<RelayResponse>;

    public processJsonData(json: any): void;

    public clone(): RelayResponse;

    public toString(): string;
  }

  export interface PayloadData {
    [key: string]: any;
  }

  export type QueryPayload =
    | {
        data?: PayloadData | null;
        errors?: any[];
        rerunVariables?: Variables;
      }
    | RelayResponse;

  // this is workaround should be class from relay-runtime/network/RelayObservable.js
  export type RelayObservable<T> = Promise<T>;
  // Note: This should accept Subscribable<T> instead of RelayObservable<T>,
  // however Flow cannot yet distinguish it from T.

  export type ObservableFromValue<T> = RelayObservable<T> | Promise<T> | T;

  export type FetchHookFunction = (
    operation: ConcreteBatch,
    variables: Variables,
    cacheConfig: CacheConfig,
    uploadables?: UploadableMap | null
  ) => void | ObservableFromValue<QueryPayload>;

  export interface RelayNetworkLayerOpts {
    subscribeFn?: SubscribeFunction;
    beforeFetch?: FetchHookFunction;
    noThrow?: boolean;
  }

  export interface Disposable {
    dispose(): void;
  }

  export type SubscribeFunction = (
    operation: ConcreteBatch,
    variables: Variables,
    cacheConfig: CacheConfig,
    observer: any
  ) => RelayObservable<QueryPayload> | Disposable;

  export type Requests = RelayRequest[];

  export default class RelayRequestBatch {
    public fetchOpts: Partial<FetchOpts>;
    public requests: Requests;

    constructor(requests: Requests);
    public setFetchOption(name: string, value: any): void;
    public setFetchOptions(opts: Object): void;
    public getBody(): string;
    public prepareBody(): string;
    public getIds(): string[];
    public getID(): string;
    public isMutation(): boolean;
    public isFormData(): boolean;
    public clone(): RelayRequestBatch;
    public getVariables(): Variables;
    public getQueryString(): string;
  }

  export type RelayRequestAny = RelayRequest | RelayRequestBatch;
  export type MiddlewareNextFn = (
    req: RelayRequestAny
  ) => Promise<RelayResponse>;
  export type Middleware = (next: MiddlewareNextFn) => MiddlewareNextFn;
  export type MiddlewareRawNextFn = (
    req: RelayRequestAny
  ) => Promise<FetchResponse>;

  export interface MiddlewareRaw {
    isRawMiddleware: true;
    (next: MiddlewareRawNextFn): MiddlewareRawNextFn;
  }

  export interface MiddlewareSync {
    execute: (
      operation: ConcreteBatch,
      variables: Variables,
      cacheConfig: CacheConfig,
      uploadables?: UploadableMap | null
    ) => ObservableFromValue<QueryPayload>;
  }

  export class RelayNetworkLayer {
    constructor(
      middlewares: Array<Middleware | MiddlewareSync | MiddlewareRaw>,
      opts?: RelayNetworkLayerOpts
    );
  }

  export interface AuthMiddlewareOpts {
    token?:
      | string
      | Promise<string>
      | ((req: RelayRequestAny) => string | Promise<string>);
    tokenRefreshPromise?: (
      req: RelayRequestAny,
      res: RelayResponse
    ) => string | Promise<string>;
    allowEmptyToken?: boolean;
    prefix?: string;
    header?: string;
  }

  export const authMiddleware: (opts?: AuthMiddlewareOpts) => Middleware;

  export interface BatchRequestMap {
    [reqId: string]: RequestWrapper;
  }

  export interface RequestWrapper {
    req: RelayRequest;
    completeOk: (res: Object) => void;
    completeErr: (e: Error) => void;
    done: boolean;
    duplicates: RequestWrapper[];
  }

  export interface BatchMiddlewareOpts {
    batchUrl?:
      | string
      | Promise<string>
      | ((requestMap: BatchRequestMap) => string | Promise<string>);
    batchTimeout?: number;
    maxBatchSize?: number;
    allowMutations?: boolean;
    method?: "POST" | "GET";
    headers?:
      | Headers
      | Promise<Headers>
      | ((req: RelayRequestBatch) => Headers | Promise<Headers>);
    // Avaliable request modes in fetch options. For details see https://fetch.spec.whatwg.org/#requests
    credentials?: FetchOpts["credentials"];
    mode?: FetchOpts["mode"];
    cache?: FetchOpts["cache"];
    redirect?: FetchOpts["redirect"];
  }

  export const batchMiddleware: (opts?: BatchMiddlewareOpts) => Middleware;

  interface CacheMiddlewareOpts {
    size?: number;
    ttl?: number;
    onInit?: (cache: any /* TODO: missing type QueryResponseCache */) => any;
    allowMutations?: boolean;
    allowFormData?: boolean;
    clearOnMutation?: boolean;
  }

  export const cacheMiddleware: (opts?: CacheMiddlewareOpts) => Middleware;

  export interface GqlErrorMiddlewareOpts {
    logger?: Function;
    prefix?: string;
    disableServerMiddlewareTip?: boolean;
  }
  export const errorMiddleware: (opts?: GqlErrorMiddlewareOpts) => Middleware;

  export interface LoggerMiddlewareOpts {
    logger?: Function;
  }
  export const loggerMiddleware: (opts?: LoggerMiddlewareOpts) => Middleware;

  export interface PerfMiddlewareOpts {
    logger?: Function;
  }
  export const performanceMiddleware: (opts?: PerfMiddlewareOpts) => Middleware;

  export interface ProgressOpts {
    sizeHeader?: string;
    onProgress: (runningTotal: number, totalSize?: number | null) => any;
  }
  export const progressMiddleware: (opts?: ProgressOpts) => Middleware;

  export type RetryAfterFn = (attempt: number) => number | false;
  export type ForceRetryFn = (runNow: Function, delay: number) => any;
  export type StatusCheckFn = (
    statusCode: number,
    req: RelayRequestAny,
    res: RelayResponse
  ) => boolean;

  export interface RetryMiddlewareOpts {
    fetchTimeout?: number;
    retryDelays?: number[] | RetryAfterFn;
    statusCodes?: number[] | false | StatusCheckFn;
    logger?: Function | false;
    allowMutations?: boolean;
    allowFormData?: boolean;
    forceRetry?: ForceRetryFn | false;
  }
  export const retryMiddleware: (opts?: RetryMiddlewareOpts) => Middleware;

  export interface UrlMiddlewareOpts {
    url:
      | string
      | Promise<string>
      | ((req: RelayRequest) => string | Promise<string>);
    method?: "POST" | "GET";
    headers?:
      | Headers
      | Promise<Headers>
      | ((req: RelayRequest) => Headers | Promise<Headers>);
    // Avaliable request modes in fetch options. For details see https://fetch.spec.whatwg.org/#requests
    credentials?: FetchOpts["credentials"];
    mode?: FetchOpts["mode"];
    cache?: FetchOpts["cache"];
    redirect?: FetchOpts["redirect"];
  }
  export const urlMiddleware: (opts?: UrlMiddlewareOpts) => Middleware;
}
