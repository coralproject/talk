export default function isNonNullArray<T>(arr: (T | null)[]): arr is T[] {
  for (const item of arr) {
    if (item === null) {
      return false;
    }
  }

  return true;
}
