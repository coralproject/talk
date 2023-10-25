export const partition = <T extends unknown>(
  items: T[],
  predicate: (item: T) => boolean
): {
  passed: T[];
  failed: T[];
} => {
  const passed: T[] = [];
  const failed: T[] = [];
  for (const item of items) {
    if (predicate(item)) {
      passed.push(item);
    } else {
      failed.push(item);
    }
  }

  return { passed, failed };
};
