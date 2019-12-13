/**
 * Purges relay metadata from response e.g. information about fragments.
 *
 * @param data Relay response data
 */
export default function purgeMetadata<T>(data: T): T {
  switch (typeof data) {
    case "object": {
      if (data === null) {
        return data;
      }
      if (Array.isArray(data)) {
        return data.map(purgeMetadata) as any;
      }
      const result: any = {};
      Object.keys(data)
        .filter(k => !k.startsWith("__"))
        .forEach(k => {
          result[k] = purgeMetadata((data as any)[k]);
        });
      return result;
    }
    default:
      return data;
  }
}
