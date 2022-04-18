import { Environment } from "relay-runtime";

/**
 * RecordSourceProxy has the same shape as the underlying Schema Type, but
 * makes all fields optional and readonly.
 */
type RecordSourceProxy<T> = T extends object
  ? {
      readonly [P in keyof T]: T[P] extends Array<infer U>
        ? ReadonlyArray<RecordSourceProxy<U>>
        : T[P] extends ReadonlyArray<infer V>
        ? ReadonlyArray<RecordSourceProxy<V>>
        : RecordSourceProxy<T[P]>;
    }
  : T;

/**
 * createProxy returns a proxy for `recordSource`, that automatically
 * resolves references to other record sources.
 */
const createProxy = <T = any>(
  environment: Environment,
  recordSource: Record<string, any>
) => {
  const target = {};
  const proxy: ProxyHandler<any> = {
    ownKeys() {
      return Object.keys(recordSource);
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true,
      };
    },
    has(_, prop) {
      return prop in recordSource;
    },
    get(_, prop) {
      const rsrc = recordSource as any;
      if (rsrc[prop]) {
        // Resolve references.
        if (rsrc[prop].__ref) {
          return lookup(environment, rsrc[prop].__ref);
        }
        // Resolve array references.
        if (rsrc[prop].__refs) {
          return rsrc[prop].__refs.map((v: string) => lookup(environment, v));
        }
      }
      return rsrc[prop];
    },
  };
  return new Proxy(target, proxy) as RecordSourceProxy<T>;
};

/**
 * Lookup the Relay Cache with given object id. Returns a `RecordSourceProxy``
 * for easy traversing through the Relay Cache.
 *
 * Attention: This will usually cause data dependencies to other
 * components if you are looking into non-local-state,
 * make sure to make a comment about that.
 */
export default function lookup<T = any>(
  environment: Environment,
  id: string
): RecordSourceProxy<T> | null {
  const recordSource = environment.getStore().getSource().get(id);
  if (!recordSource) {
    return null;
  }
  return createProxy<T>(environment, recordSource);
}
