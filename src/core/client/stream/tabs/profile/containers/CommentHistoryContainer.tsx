import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "talk-framework/lib/relay";
import { CommentHistoryContainer_me as CommentsData } from "talk-stream/__generated__/CommentHistoryContainer_me.graphql";

import CommentHistory from "../components/CommentHistory";

interface CommentHistoryContainerProps {
  me: CommentsData;
}

export class CommentHistoryContainer extends React.Component<
  CommentHistoryContainerProps
> {
  public render() {
    return <CommentHistory me={this.props.me} />;
  }
}
const enhanced = withFragmentContainer<CommentHistoryContainerProps>({
  me: graphql`
    fragment CommentHistoryContainer_me on User {
      comments {
        edges {
          node {
            id
            body
          }
        }
      }
    }
  `,
})(CommentHistoryContainer);

export default enhanced;
