import { EventEmitter2 } from "eventemitter2";
import qs, { parse } from "querystringify";

import { buildURL } from "coral-framework/utils";

import { CleanupCallback } from "./types";

/**
 * From the `querystringify` project:
 * This transforms a given object in to a query string.
 * By default we return the query string without a ? prefix.
 * If you want to prefix it by default simply supply true as second argument.
 * If it should be prefixed by something else simply supply a string with the
 * prefix value as second argument.
 *
 * In addition keys that have an undefined value are removed from the query.
 */
function stringifyQuery(
  obj: Record<string, any>,
  prefix?: string | boolean
): string {
  const copy: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) {
      return;
    }

    copy[key] = obj[key];
  });
  return qs.stringify(copy, prefix);
}

function getCurrentCommentID() {
  return parse(location.search).commentID;
}

const withSetCommentID = (
  streamEventEmitter: EventEmitter2
): CleanupCallback => {
  // Add the permalink comment id to the query.
  streamEventEmitter.on("stream.setCommentID", (id: string) => {
    const search = stringifyQuery({
      ...parse(location.search),
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
