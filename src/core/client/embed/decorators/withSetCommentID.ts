import { parseQuery, stringifyQuery } from "talk-common/utils";
import { buildURL } from "talk-framework/utils";

import { Decorator } from "./types";

function getCurrentCommentID() {
  return parseQuery(location.search).commentID;
}

const withSetCommentID: Decorator = pym => {
  // Add the permalink comment id to the query.
  pym.onMessage("setCommentID", (id: string) => {
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
    pym.sendMessage("setCommentID", commentID || "");
  };
  window.addEventListener("popstate", sendSetCommentID);

  // Cleanup.
  return () => {
    window.removeEventListener("popstate", sendSetCommentID);
  };
};

export default withSetCommentID;
