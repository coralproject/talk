import * as React from "react";
import { FunctionComponent } from "react";

import { graphql, useLocal } from "coral-framework/lib/relay";
import { CommentsPaneQueryLocal } from "coral-stream/__generated__/CommentsPaneQueryLocal.graphql";

import PermalinkView from "./PermalinkView";
import Stream from "./Stream";

const CommentsPaneQuery: FunctionComponent = () => {
  const [local] = useLocal<CommentsPaneQueryLocal>(graphql`
    fragment CommentsPaneQueryLocal on Local {
      commentID
    }
  `);
  const showPermalinkView = Boolean(local.commentID);
  if (showPermalinkView) {
    return <PermalinkView />;
  }
  return <Stream />;
};

export default CommentsPaneQuery;
