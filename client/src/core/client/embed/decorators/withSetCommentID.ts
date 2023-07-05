import { parseQuery, stringifyQuery } from "coral-common/utils";
import { buildURL } from "coral-framework/utils";
import { EventEmitter2 } from "eventemitter2";

import { CleanupCallback } from "./types";

function getCurrentCommentID() {
  return parseQuery(location.search).commentID;
}

const withSetCommentID = (
  streamEventEmitter: EventEmitter2
): CleanupCallback => {
  // Add the permalink comment id to the query.
  streamEventEmitter.on("stream.setCommentID", (id: string) => {
    const search = stringifyQuery({
      ...parseQuery(location.search),
      commentID: id || undefined,
    });

    // Remove the commentId url param.
    const url = buildURL({ search });

    // Change the url.
    window.history.pushState({}, document.title, url);
  });

  // Send new commentID when history state changes.
  const sendSetCommentID = (e: Event) => {
    const commentID = getCurrentCommentID();
    streamEventEmitter.emit("embed.setCommentID", commentID || "");
  };
  window.addEventListener("popstate", sendSetCommentID);

  // Cleanup.
  return () => {
    window.removeEventListener("popstate", sendSetCommentID);
  };
};

export default withSetCommentID;
