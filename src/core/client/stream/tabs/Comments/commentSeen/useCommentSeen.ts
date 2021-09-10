import { Listener } from "eventemitter2";
import { useCallback, useContext, useEffect } from "react";

import useInMemoryState from "coral-framework/hooks/useInMemoryState";
import { useCoralContext } from "coral-framework/lib/bootstrap/CoralContext";

import {
  CommentSeenContext,
  COMMIT_SEEN_EVENT,
  CommitSeenEventData,
} from "./CommentSeenContext";

/**
 * Returns boolean when the comment has been seen already.
 * Otherwise the comment with the `commentID` will be marked as
 * seen for the next refresh. Must be called within a `<CommentSeenProvider />`
 */
export default function useCommentSeen(commentID: string): boolean {
  const { enabled, seenMap, markSeen } = useContext(CommentSeenContext);
  const { eventEmitter } = useCoralContext();

  const [commited, setCommited] = useInMemoryState(
    `commitedSeen:${commentID}`,
    false
  );

  const seen =
    // Return seen=true when `commit` was called.
    commited ||
    // Return seen=true, when we couldn't acquire a seen map.
    (seenMap ? Boolean(seenMap[commentID]) : true);

  // Commiting marks a previously unread comment as seen.
  const commit = useCallback(() => {
    setCommited(true);
  }, [setCommited]);

  useEffect(() => {
    if (enabled && seen === false) {
      // Tells CommentSeenProvider to mark comment as seen in the database.
      markSeen(commentID);
    }
  }, [commentID, markSeen, seen, enabled]);

  useEffect(() => {
    if (seen) {
      return;
    }
    const listener = eventEmitter.on(
      // Event is called e.g. when `Unmark all` is activated.
      COMMIT_SEEN_EVENT,
      ({ commentID: commitCommentID }: CommitSeenEventData) => {
        if (commitCommentID && commitCommentID !== commentID) {
          return;
        }
        commit();
      },
      { objectify: true }
    ) as Listener;
    return () => {
      listener.off();
    };
  }, [commentID, commit, eventEmitter, seen]);

  return seen;
}
