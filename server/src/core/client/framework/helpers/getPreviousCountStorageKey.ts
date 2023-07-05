export default function getPreviousCountStorageKey(storyID: string): string {
  return `v1:previousCount:${storyID}`;
}
