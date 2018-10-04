import React from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "talk-framework/helpers";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { CommentsHistoryContainer_asset as AssetData } from "talk-stream/__generated__/CommentsHistoryContainer_asset.graphql";
import { CommentsHistoryContainer_me as CommentsData } from "talk-stream/__generated__/CommentsHistoryContainer_me.graphql";
import {
  SetCommentIDMutation,
  withSetCommentIDMutation,
} from "talk-stream/mutations";
import CommentsHistory from "../components/CommentsHistory";

interface CommentsHistoryContainerProps {
  setCommentID: SetCommentIDMutation;
  me: CommentsData;
  asset: AssetData;
}

export class CommentsHistoryContainer extends React.Component<
  CommentsHistoryContainerProps
> {
  private onGoToConversation = (id: string) => {
    this.props.setCommentID({ id });
  };
  public render() {
    const comments = this.props.me.comments.edges.map(edge => ({
      ...edge.node,
      conversationURL: getURLWithCommentID(edge.node.asset.url, edge.node.id),
      onGotoConversation: (e: React.MouseEvent) => {
        if (this.props.asset.id === edge.node.asset.id) {
          this.onGoToConversation(edge.node.id);
          e.preventDefault();
        }
      },
    }));
    return <CommentsHistory comments={comments} />;
  }
}

const enhanced = withSetCommentIDMutation(
  withFragmentContainer<CommentsHistoryContainerProps>({
    asset: graphql`
      fragment CommentsHistoryContainer_asset on Asset {
        id
      }
    `,
    me: graphql`
      fragment CommentsHistoryContainer_me on User {
        comments {
          edges {
            node {
              id
              body
              createdAt
              replyCount
              asset {
                id
                title
                url
              }
            }
          }
        }
      }
    `,
  })(CommentsHistoryContainer)
);

export default enhanced;
