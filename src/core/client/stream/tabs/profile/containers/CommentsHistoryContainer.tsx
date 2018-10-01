import React from "react";
import { graphql } from "react-relay";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { CommentsHistoryContainer_me as CommentsData } from "talk-stream/__generated__/CommentsHistoryContainer_me.graphql";
import {
  SetCommentIDMutation,
  withSetCommentIDMutation,
} from "talk-stream/mutations";
import CommentsHistory from "../components/CommentsHistory";

interface CommentsHistoryContainerProps {
  setCommentID: SetCommentIDMutation;
  me: CommentsData;
}

export class CommentsHistoryContainer extends React.Component<
  CommentsHistoryContainerProps
> {
  private onGoToConversation = (id: string) => {
    this.props.setCommentID({ id });
  };
  public render() {
    return (
      <CommentsHistory
        me={this.props.me}
        onGoToConversation={this.onGoToConversation}
      />
    );
  }
}

const enhanced = withSetCommentIDMutation(
  withFragmentContainer<CommentsHistoryContainerProps>({
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
                title
              }
            }
          }
        }
      }
    `,
  })(CommentsHistoryContainer)
);

export default enhanced;
