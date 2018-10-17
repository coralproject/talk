import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "talk-framework/lib/relay";
import { CommentHistoryContainer_asset as AssetData } from "talk-stream/__generated__/CommentHistoryContainer_asset.graphql";
import { CommentHistoryContainer_me as MeData } from "talk-stream/__generated__/CommentHistoryContainer_me.graphql";
import {
  SetCommentIDMutation,
  withSetCommentIDMutation,
} from "talk-stream/mutations";
import CommentHistory from "../components/CommentHistory";

interface CommentHistoryContainerProps {
  setCommentID: SetCommentIDMutation;
  me: MeData;
  asset: AssetData;
}

export class CommentHistoryContainer extends React.Component<
  CommentHistoryContainerProps
> {
  public render() {
    const comments = this.props.me.comments.edges.map(edge => edge.node);
    return <CommentHistory asset={this.props.asset} comments={comments} />;
  }
}

const enhanced = withSetCommentIDMutation(
  withFragmentContainer<CommentHistoryContainerProps>({
    asset: graphql`
      fragment CommentHistoryContainer_asset on Asset {
        ...HistoryCommentContainer_asset
      }
    `,
    me: graphql`
      fragment CommentHistoryContainer_me on User {
        comments {
          edges {
            node {
              id
              ...HistoryCommentContainer_comment
            }
          }
        }
      }
    `,
  })(CommentHistoryContainer)
);

export default enhanced;
