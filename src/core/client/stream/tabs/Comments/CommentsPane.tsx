import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useLocal } from "coral-framework/lib/relay";
import { GQLSTORY_MODE } from "coral-framework/schema";

import { CommentsPaneLocal } from "coral-stream/__generated__/CommentsPaneLocal.graphql";

import LiveTabQuery from "../Live";
import PermalinkView from "./PermalinkView";
import Stream from "./Stream";

const CommentsPane: FunctionComponent = () => {
  const [local] = useLocal<CommentsPaneLocal>(graphql`
    fragment CommentsPaneLocal on Local {
      commentID
      storyMode
    }
  `);
  const showPermalinkView = Boolean(local.commentID);
  if (showPermalinkView) {
    return <PermalinkView />;
  }

  if (local.storyMode === GQLSTORY_MODE.CHAT) {
    return <LiveTabQuery />;
  }
  return <Stream />;
};

export default CommentsPane;
