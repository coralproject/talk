import React from "react";
import { graphql } from "react-relay";
import {
  withFragmentContainer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { CommentsHistoryContainer_me as CommentsData } from "talk-stream/__generated__/CommentsHistoryContainer_me.graphql";
import { CommentsHistoryContainerLocal as Local } from "talk-stream/__generated__/CommentsHistoryContainerLocal.graphql";
import CommentsHistory from "../components/CommentsHistory";

import {
  SetCommentIDMutation,
  withSetCommentIDMutation,
} from "talk-stream/mutations";

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
            }
          }
        }
      }
    `,
  })(CommentsHistoryContainer)
);

export default enhanced;
