import qs from "query-string";

import { buildURL } from "../utils";
import { Decorator } from "./";

const withSetCommentID: Decorator = pym => {
  // Add the permalink comment id to the query.
  pym.onMessage("setCommentID", (id: string) => {
    const search = qs.stringify({
      ...qs.parse(location.search),
      commentID: id || undefined,
    });

    // Remove the commentId url param.
    const url = buildURL({ search });

    // Change the url.
    window.history.replaceState({}, document.title, url);
  });
};

export default withSetCommentID;
