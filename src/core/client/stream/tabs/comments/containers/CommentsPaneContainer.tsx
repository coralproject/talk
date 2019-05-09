import * as React from "react";
import { FunctionComponent } from "react";

import { graphql, withLocalStateContainer } from "talk-framework/lib/relay";
import { CommentsPaneContainerLocal as Local } from "talk-stream/__generated__/CommentsPaneContainerLocal.graphql";

import CommentsPane from "../components/CommentsPane";

interface Props {
  local: Local;
}

const CommentsPaneContainer: FunctionComponent<Props> = ({
  local: { commentID },
}) => {
  return <CommentsPane showPermalinkView={!!commentID} />;
};

const enhanced = withLocalStateContainer(
  graphql`
    fragment CommentsPaneContainerLocal on Local {
      commentID
    }
  `
)(CommentsPaneContainer);

export default enhanced;
