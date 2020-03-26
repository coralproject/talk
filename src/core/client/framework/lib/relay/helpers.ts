// TODO: (cvle) graphql tags should be inlined instead.

/**
 * graphql tags currently come as resolved or unresolved es6 modules
 * with an default export. Resolve to the actual default export.
 * Applies to a single module.
 */
export function resolveModule<T>(module: T): T {
  if (typeof module === "function") {
    return module().default as T;
  }
  return (module as any).default;
}

/**
 * graphql tags currently come as resolved or unresolved es6 modules
 * with an default export. Resolve to the actual default export.
 * Applies to a map of records.
 */
export function resolveModuleObject<T>(module: T): T {
  const r: Record<string, any> = {};
  Object.keys(module).forEach((k) => {
    r[k] = resolveModule((module as any)[k]);
  });
  return r as any;
}
