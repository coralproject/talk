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

export const KEEP_ITEM_COUNT = 200000; // 10.000 are roughly 500kb
export const KEEP_DURATION_DAYS = 30;

const KEEP_DURATION = 1000 * 60 * 60 * 24 * KEEP_DURATION_DAYS;

type CommentID = string;
type SeenMap = Record<CommentID, 1>;

/**
 * ContextState is passed to the context.
 */
interface ContextState {
  /** Whether or not CommentSeen has been enabled */
  enabled: boolean;
  /** Whether or not ZKey traversal has been enabled */
  enabledZKey: boolean;
  /** Map of all seen comments in this story */
  seenMap: SeenMap | null;
  /** Mark comment as seen in the database, will only see effect after refresh */
  markSeen: (id: CommentID) => void;
  /** Commit specified comment or all comments marked as seen using `markSeen` into `seen` */
  commitSeen: (id?: CommentID) => void;
}

/**
 * The meta data keeps track of amount of data saved for a particular
 * story-user combination and the timestamp of last access.
 */
type Meta = Record<
  string,
  {
    timestamp: number;
    count: number;
  }
>;

/**
 * CommentSeenDB is responsible for handling the comment seen data.
 */
export class CommentSeenDB {
  private storage: PromisifiedStorage<any>;
  private markSeenQueues: Record<string, CommentID[]> = {};
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

  /**
   * Performs cleanups to keep the storage cap.
   */
  private async _garbageCollect() {
    let changed = false;
    const meta = await this._getMeta();
    let keys = Object.keys(meta);

    // Find data that is too old.
    for (const key of keys) {
      if (Date.now() - meta[key].timestamp > KEEP_DURATION) {
        // Data is older than `KEEP_DURATION` -> delete!
        await this.storage.removeItem(key);
        delete meta[key];
        changed = true;
      }
    }

    // Figure out current total items.
    keys = Object.keys(meta);
    const totalItems = keys.reduce((val, key) => val + meta[key].count, 0);

    // Determine if we have an excess of data.
    let excess = Math.max(totalItems - KEEP_ITEM_COUNT, 0);

    // Keep deleting until the excess is gone.
    while (excess > 0) {
      let oldest = "";
      let oldestTimestamp = Number.MAX_VALUE;

      // Find oldest record.
      for (const key of keys) {
        if (meta[key].timestamp < oldestTimestamp) {
          oldest = key;
          oldestTimestamp = meta[key].timestamp;
        }
      }
      if (!oldest) {
        break;
      }

      // Remove oldest record.
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
    // Upon accessing the seen map, we update the meta timestamp.
    await this._updateMetaTimestamp(key);
    return this._getAllSeenComments(key);
  }

  /**
   * A debounced batch processor for handling the
   * `markSeen` calls.
   */
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

      // Meanwhile, new comment ids could have been added to a queue -> repeat.
      if (Object.keys(this.markSeenQueues).length > 0) {
        void this._processMarkSeenQueuesDebounced();
      }
    },
    100,
    { trailing: true }
  );

  /**
   * Mark commentID as seen. This is handled asynchronously.
   */
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

const CommentSeenContext = createContext<ContextState>({
  enabled: false,
  enabledZKey: false,
  seenMap: {},
  markSeen: () => {},
  commitSeen: () => {},
});

export const COMMIT_SEEN_EVENT = "commentSeen.commit";
export interface CommitSeenEventData {
  commentID?: string;
}

/**
 * This provides the necessary Context for the `useCommentSeen` hook.
 */
function CommentSeenProvider(props: {
  storyID: string;
  viewerID?: string;
  children: React.ReactNode;
}) {
  const { indexedDBStorage, eventEmitter } = useCoralContext();

  const [local] = useLocal<CommentSeenContextLocal>(graphql`
    fragment CommentSeenContextLocal on Local {
      enableCommentSeen
      enableZKey
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

  // Commit seen event will propagate to comments that use `useCommentSeen`
  const commitSeen = useCallback(
    (commentID?: string) => {
      eventEmitter.emit(COMMIT_SEEN_EVENT, {
        commentID,
      } as CommitSeenEventData);
    },
    [eventEmitter]
  );

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
    () => ({
      enabled: local.enableCommentSeen,
      enabledZKey: local.enableCommentSeen && local.enableZKey,
      seenMap: initialSeen,
      markSeen,
      commitSeen,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [local.enableCommentSeen, initialSeen, commitSeen, markSeen]
  );
  return <CommentSeenContext.Provider value={value} {...props} />;
}

export { CommentSeenProvider, CommentSeenContext };
