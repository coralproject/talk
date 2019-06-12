import * as React from "react";
import { FunctionComponent } from "react";

import { graphql, useLocal } from "coral-framework/lib/relay";
import { CommentsPaneLocal } from "coral-stream/__generated__/CommentsPaneLocal.graphql";

import PermalinkView from "./PermalinkView";
import Stream from "./Stream";

const CommentsPane: FunctionComponent = () => {
  const [local] = useLocal<CommentsPaneLocal>(graphql`
    fragment CommentsPaneLocal on Local {
      commentID
    }
  `);
  const showPermalinkView = Boolean(local.commentID);
  if (showPermalinkView) {
    return <PermalinkView />;
  }
  return <Stream />;
};

export default CommentsPane;
