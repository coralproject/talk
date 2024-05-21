import React, { FunctionComponent, useEffect, useState } from "react";
import { graphql } from "react-relay";

import { parseQuery } from "coral-common/common/lib/utils";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useLocal } from "coral-framework/lib/relay";
import { parseURL } from "coral-framework/utils";

import { CommentsPaneLocal } from "coral-stream/__generated__/CommentsPaneLocal.graphql";

import IllegalContentReportView from "./IllegalContentReportView";
import PermalinkView from "./PermalinkView";
import Stream from "./Stream";

const CommentsPane: FunctionComponent = () => {
  const [local] = useLocal<CommentsPaneLocal>(graphql`
    fragment CommentsPaneLocal on Local {
      commentID
    }
  `);
  const { window } = useCoralContext();
  const showPermalinkView = Boolean(local.commentID);
  const [view, setView] = useState<null | string>(null);

  // here we look for a view query param in the url and direct to a different view if needed
  useEffect(() => {
    if (showPermalinkView) {
      const parsedURL = parseURL(window.location.href);
      const query = parseQuery(parsedURL.search);
      const queryView = query.view;
      if (queryView) {
        setView(queryView);
      }
    }
  }, [window.location.href, showPermalinkView, setView]);

  if (showPermalinkView) {
    if (view === "illegalContentReport") {
      return <IllegalContentReportView />;
    }
    return <PermalinkView />;
  }
  return <Stream />;
};

export default CommentsPane;
