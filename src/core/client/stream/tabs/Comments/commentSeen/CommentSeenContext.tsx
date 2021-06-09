import { debounce } from "lodash";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useLocal } from "coral-framework/lib/relay";
import { PromisifiedStorage } from "coral-framework/lib/storage";

import { CommentSeenContextLocal } from "coral-stream/__generated__/CommentSeenContextLocal.graphql";

const KEEP_ITEM_COUNT = 200000; // 10.000 are roughly 500kb
const KEEP_DURATION_DAYS = 30;

const KEEP_DURATION = 1000 * 60 * 60 * 24 * KEEP_DURATION_DAYS;

type CommentID = string;
type StoryID = string;
type SeenMap = Record<CommentID, 1>;
interface State {
  enabled: boolean;
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

  constructor(storage: PromisifiedStorage<any>) {
    this.storage = storage;
    void this._garbageCollect();
  }
  private _getKey(storyID: string, viewerID: string) {
    return viewerID + ":" + storyID;
  }

  private async _getMeta(): Promise<Meta> {
    return ((await this.storage.getItem("meta")) as Meta) || {};
  }

  private async _increaseMetaCount(key: string, by: number) {
    const meta = await this._getMeta();
    const count = (meta[key]?.count || 0) + by;
    meta[key] = { count, timestamp: Date.now() };
    await this.storage.setItem("meta", meta);
  }

  private async _updateMetaTimestamp(key: string) {
    const meta = await this._getMeta();
    if (key in meta) {
      meta[key].timestamp = Date.now();
      await this.storage.setItem("meta", meta);
    }
  }

  private async _garbageCollect() {
    let changed = false;
    const meta = await this._getMeta();
    let keys = Object.keys(meta);
    for (const key of keys) {
      if (Date.now() - meta[key].timestamp > KEEP_DURATION) {
        // Remove old data.
        await this.storage.removeItem(key);
        delete meta[key];
        changed = true;
      }
    }

    keys = Object.keys(meta);
    const totalItems = keys.reduce((val, key) => val + meta[key].count, 0);
    let excess = Math.max(totalItems - KEEP_ITEM_COUNT, 0);
    while (excess > 0) {
      let oldest = "";
      let oldestTimestamp = Number.MAX_VALUE;
      for (const key of keys) {
        if (meta[key].timestamp < oldestTimestamp) {
          oldest = key;
          oldestTimestamp = meta[key].timestamp;
        }
      }
      if (!oldest) {
        break;
      }

      // Remove oldest story.
      excess -= meta[oldest].count;
      await this.storage.removeItem(oldest);
      delete meta[oldest];
      keys.splice(keys.indexOf(oldest));
      changed = true;
    }
    if (!changed) {
      return;
    }
    await this.storage.setItem("meta", meta);
  }

  private async _getAllSeenComments(key: string) {
    return ((await this.storage.getItem(key)) as SeenMap) || {};
  }

  public async getAllSeenComments(storyID: string, viewerID: string) {
    const key = this._getKey(storyID, viewerID);
    await this._updateMetaTimestamp(key);
    return this._getAllSeenComments(key);
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
      const keys = Object.keys(queues);
      for (const key of keys) {
        const seenMap = await this._getAllSeenComments(key);
        queues[key].forEach((commentID) => {
          seenMap[commentID] = 1;
        });
        await this._increaseMetaCount(key, queues[key].length);
        await this.storage.setItem(key, seenMap);
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

  public markSeen(storyID: string, viewerID: string, commentID: string) {
    const key = this._getKey(storyID, viewerID);
    if (this.markSeenQueues[key]) {
      this.markSeenQueues[key].push(commentID);
    } else {
      this.markSeenQueues[key] = [commentID];
    }
    void this._processMarkSeenQueuesDebounced();
  }
}

const CommentSeenContext = createContext<State>({
  enabled: false,
  seen: {},
  markSeen: () => {},
});

function CommentSeenProvider(props: {
  storyID: string;
  viewerID?: string;
  children: React.ReactNode;
}) {
  const { indexedDBStorage } = useCoralContext();

  const [local] = useLocal<CommentSeenContextLocal>(graphql`
    fragment CommentSeenContextLocal on Local {
      enableCommentSeen
    }
  `);

  const [initialSeen, setInitialSeen] = useState<SeenMap | null>(null);
  const seenRef = useRef<SeenMap>({});

  const db = useMemo(() => new CommentSeenDB(indexedDBStorage), [
    indexedDBStorage,
  ]);

  useEffect(() => {
    if (!local.enableCommentSeen || !props.viewerID) {
      return;
    }
    let stopped = false;
    async function callback() {
      const result = await db.getAllSeenComments(
        props.storyID,
        props.viewerID!
      );
      if (stopped) {
        return;
      }
      seenRef.current = result || {};
      setInitialSeen({ ...seenRef.current });
    }
    void callback();
    return () => {
      stopped = true;
    };
  }, [db, props.storyID, props.viewerID, local.enableCommentSeen]);

  const markSeen = useCallback(
    (id: string) => {
      if (!props.viewerID || !seenRef.current || seenRef.current[id]) {
        return;
      }
      seenRef.current[id] = 1;
      void db.markSeen(props.storyID, props.viewerID, id);
    },
    [db, props.storyID, props.viewerID]
  );
  const value = useMemo(
    () => ({ enabled: local.enableCommentSeen, seen: initialSeen, markSeen }),
    [local.enableCommentSeen, initialSeen, markSeen]
  );
  return <CommentSeenContext.Provider value={value} {...props} />;
}

export { CommentSeenProvider, CommentSeenContext };
