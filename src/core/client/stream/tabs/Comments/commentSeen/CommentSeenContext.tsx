import { debounce } from "lodash";
import { Child } from "pym.js";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  createPymStorage,
  PromisifiedStorage,
} from "coral-framework/lib/storage";
import createIndexedDBStorage from "coral-framework/lib/storage/IndexedDBStorage";

const KEEP_ITEM_COUNT = 200000; // 10.000 are roughly 500kb
const KEEP_DURATION_DAYS = 30;

const KEEP_DURATION = 1000 * 60 * 60 * 24 * KEEP_DURATION_DAYS;

type CommentID = string;
type StoryID = string;
type SeenMap = Record<CommentID, 1>;
interface State {
  seen: SeenMap | null;
  markSeen: (id: CommentID) => void;
}

type Meta = Record<
  StoryID,
  {
    timestamp: number;
    count: number;
  }
>;

class CommentSeenDB {
  private storage: PromisifiedStorage<any>;
  private markSeenQueues: Record<StoryID, CommentID[]> = {};
  private processingMarkSeenQueues = false;

  constructor(pym?: Child) {
    if (!("indexedDB" in window)) {
      return;
    }
    this.storage = pym
      ? createPymStorage(pym, "indexedDB")
      : createIndexedDBStorage("commentSeen");
    void this._garbageCollect();
  }

  private async _getMeta(): Promise<Meta> {
    return ((await this.storage.getItem("meta")) as Meta) || {};
  }

  private async _increaseMetaCount(storyID: string, by: number) {
    const meta = await this._getMeta();
    const count = (meta[storyID]?.count || 0) + by;
    meta[storyID] = { count, timestamp: Date.now() };
    await this.storage.setItem("meta", meta);
  }

  private async _updateMetaTimestamp(storyID: string) {
    const meta = await this._getMeta();
    if (storyID in meta) {
      meta[storyID].timestamp = Date.now();
      await this.storage.setItem("meta", meta);
    }
  }

  private async _garbageCollect() {
    let changed = false;
    const meta = await this._getMeta();
    let storyIDs = Object.keys(meta);
    for (const storyID of storyIDs) {
      if (Date.now() - meta[storyID].timestamp > KEEP_DURATION) {
        // Remove old data.
        await this.storage.removeItem(storyID);
        delete meta[storyID];
        changed = true;
      }
    }

    storyIDs = Object.keys(meta);
    const totalItems = storyIDs.reduce(
      (val, storyID) => val + meta[storyID].count,
      0
    );
    let excess = Math.max(totalItems - KEEP_ITEM_COUNT, 0);
    while (excess > 0) {
      let oldest = "";
      let oldestTimestamp = Number.MAX_VALUE;
      for (const storyID of storyIDs) {
        if (meta[storyID].timestamp < oldestTimestamp) {
          oldest = storyID;
          oldestTimestamp = meta[storyID].timestamp;
        }
      }
      if (!oldest) {
        break;
      }

      // Remove oldest story.
      excess -= meta[oldest].count;
      await this.storage.removeItem(oldest);
      delete meta[oldest];
      storyIDs.splice(storyIDs.indexOf(oldest));
      changed = true;
    }
    if (!changed) {
      return;
    }
    await this.storage.setItem("meta", meta);
  }

  private async _getAllSeenComments(storyID: string) {
    return ((await this.storage.getItem(storyID)) as SeenMap) || {};
  }

  public async getAllSeenComments(storyID: string) {
    await this._updateMetaTimestamp(storyID);
    return this._getAllSeenComments(storyID);
  }

  private _processMarkSeenQueuesDebounced = debounce(
    async () => {
      if (this.processingMarkSeenQueues) {
        // This function should never run more than once at the same time.
        return;
      }
      this.processingMarkSeenQueues = true;
      const queues = { ...this.markSeenQueues };
      this.markSeenQueues = {};
      const storyIDs = Object.keys(queues);
      for (const storyID of storyIDs) {
        const seenMap = await this._getAllSeenComments(storyID);
        queues[storyID].forEach((commentID) => {
          seenMap[commentID] = 1;
        });
        await this._increaseMetaCount(storyID, queues[storyID].length);
        await this.storage.setItem(storyID, seenMap);
      }
      this.processingMarkSeenQueues = false;

      // Meanwhile, new comments could have been added to a queue -> repeat.
      if (Object.keys(this.markSeenQueues).length > 0) {
        void this._processMarkSeenQueuesDebounced();
      }
    },
    100,
    { trailing: true }
  );

  public markSeen(storyID: string, commentID: string) {
    if (this.markSeenQueues[storyID]) {
      this.markSeenQueues[storyID].push(commentID);
    } else {
      this.markSeenQueues[storyID] = [commentID];
    }
    void this._processMarkSeenQueuesDebounced();
  }
}

const CommentSeenContext = createContext<State>({
  seen: {},
  markSeen: () => {},
});

function CommentSeenProvider(props: {
  storyID: string;
  children: React.ReactNode;
}) {
  const { pym } = useCoralContext();
  const [initialSeen, setInitialSeen] = useState<SeenMap | null>(null);
  const seenRef = useRef<SeenMap>({});

  const db = useMemo(() => new CommentSeenDB(pym), [pym]);

  useEffect(() => {
    async function callback() {
      const result = await db.getAllSeenComments(props.storyID);
      seenRef.current = result || {};
      setInitialSeen({ ...seenRef.current });
    }
    void callback();
  }, [db, props.storyID]);

  const markSeen = useCallback(
    (id: string) => {
      if (seenRef.current[id]) {
        return;
      }
      seenRef.current[id] = 1;
      void db.markSeen(props.storyID, id);
    },
    [db, props.storyID]
  );
  const value = useMemo(() => ({ seen: initialSeen, markSeen }), [
    initialSeen,
    markSeen,
  ]);
  return <CommentSeenContext.Provider value={value} {...props} />;
}

export { CommentSeenProvider, CommentSeenContext };
