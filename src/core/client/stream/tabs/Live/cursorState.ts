import { PromisifiedStorage } from "coral-framework/lib/storage";

export default interface CursorState {
  cursor: string;
  createdAt: string;
}

const computeKey = (storyID?: string | null, storyURL?: string | null) => {
  return `liveCursor:${storyID}:${storyURL}`;
};

export const getLatestCursor = async (
  localStorage: PromisifiedStorage,
  storyID?: string | null,
  storyURL?: string | null
): Promise<CursorState | null> => {
  const key = computeKey(storyID, storyURL);
  const rawValue = await localStorage.getItem(key);
  let currentCursor: CursorState | null = null;
  if (rawValue) {
    currentCursor = JSON.parse(rawValue);
  }

  return currentCursor;
};

export const persistLatestCursor = async (
  localStorage: PromisifiedStorage,
  storyID: string | null,
  storyURL: string | null,
  state: CursorState
) => {
  const key = computeKey(storyID, storyURL);
  await localStorage.setItem(key, JSON.stringify(state));
};
