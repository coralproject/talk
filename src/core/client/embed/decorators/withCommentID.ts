import qs from "query-string";

import { buildURL } from "../utils";
import { Decorator } from "./";

const withCommentID: Decorator = (pym: any) => {
  // Remove the comment id from the query.
  pym.onMessage("view-all-comments", () => {
    const search = qs.stringify({
      ...qs.parse(location.search),
      commentId: undefined,
    });

    // Remove the commentId url param.
    const url = buildURL({ ...location, search });

    // Change the url.
    window.history.replaceState({}, document.title, url);
  });

  // Add the permalink comment id to the query.
  pym.onMessage("view-comment", (id: string) => {
    const search = qs.stringify({
      ...qs.parse(location.search),
      commentId: id,
    });

    // Remove the commentId url param.
    const url = buildURL({ ...location, search });

    // Change the url.
    window.history.replaceState({}, document.title, url);
  });
};

export default withCommentID;
