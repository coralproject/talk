export type Diff<T extends keyof any, U extends keyof any> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];

export type Omit<U, K extends keyof U> = Pick<U, Diff<keyof U, K>>;

export type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U;

export type Sub<T, U> = Pick<T, Diff<keyof T, keyof U>>;

export type RequireProperty<T, P extends keyof T> = Omit<T, P> &
  Required<Pick<T, P>>;

/**
 * Make all properties in T Writable
 */
export type Writable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Defines a type that may be a promise or a simple value return.
 */
export type Promiseable<T> = Promise<T> | T;

export type Nullable<T> = { [P in keyof T]: T[P] | null };

export type DeepWritableObject<T> = T extends object
  ? {
      -readonly [P in keyof T]: T[P] extends (Array<infer U> | undefined)
        ? Array<DeepWritableObject<U>>
        : T[P] extends (ReadonlyArray<infer V> | undefined)
        ? ReadonlyArray<DeepWritableObject<V>>
        : DeepWritableObject<T[P]>;
    }
  : T;

export type DeepWritable<T> = T extends (
  | Array<infer U>
  | ReadonlyArray<infer U>)
  ? Array<DeepWritableObject<U>>
  : DeepWritableObject<T>;

export type DeepNullable<T> = T extends object
  ? {
      [P in keyof T]: T[P] extends (Array<infer U> | undefined)
        ? Array<DeepNullable<U>>
        : T[P] extends (ReadonlyArray<infer V> | undefined)
        ? ReadonlyArray<DeepNullable<V>>
        : DeepNullable<T[P]>;
    }
  : T | null;

/**
 * Like Partial, but recurses down the object marking each field as Partial.
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: T[P] extends (Array<infer U> | undefined)
        ? Array<DeepPartial<U>>
        : T[P] extends (ReadonlyArray<infer V> | undefined)
        ? ReadonlyArray<DeepPartial<V>>
        : DeepPartial<T[P]>;
    }
  : T;

/**
 * FirstDeepPartial is like DeepPartial but applies only to the first parameters
 * on the object.
 */
export type FirstDeepPartial<T> = T extends object
  ? {
      [P in keyof T]: DeepPartial<T[P]>;
    }
  : T;
