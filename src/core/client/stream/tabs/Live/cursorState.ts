import { DeepPartial } from "coral-common/types";
import { PromisifiedStorage } from "coral-framework/lib/storage";
import { RecordProxy } from "relay-runtime";

type AdvancedUpdater = (record: RecordProxy) => void;
type LocalUpdater = DeepPartial<any> | AdvancedUpdater;

export default interface CursorState {
  cursor: string;
  createdAt: string;
}

export const persistCursorToLocalStorage = async (
  localStorage: PromisifiedStorage,
  storyID: string | null,
  storyURL: string | null,
  state: CursorState
) => {
  // Set the constant updating cursor
  const key = `liveCursor:${storyID}:${storyURL}`;
  await localStorage.setItem(key, JSON.stringify(state));
};

export const persistLatestCursorToRelay = async (
  setLocal: LocalUpdater,
  state: CursorState
) => {
  setLocal({ liveChat: { latestCursor: state.cursor } });
};

export const persistCursor = async (
  localStorage: PromisifiedStorage,
  setLocal: LocalUpdater,
  storyID: string | null,
  storyURL: string | null,
  state: CursorState
) => {
  await persistCursorToLocalStorage(localStorage, storyID, storyURL, state);
  await persistLatestCursorToRelay(setLocal, state);
};
