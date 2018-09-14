import React from "react";
import { graphql } from "react-relay";
import {
  withFragmentContainer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { CommentsHistoryContainer_me as CommentsData } from "talk-stream/__generated__/CommentsHistoryContainer_me.graphql";
import { CommentsHistoryContainerLocal as Local } from "talk-stream/__generated__/CommentsHistoryContainerLocal.graphql";
import CommentsHistory from "../components/CommentsHistory";

interface CommentsHistoryContainerProps {
  local: Local;
  me: CommentsData;
}

export class CommentsHistoryContainer extends React.Component<
  CommentsHistoryContainerProps
> {
  private goToConversation = () => {
    if (this.props.local.assetURL) {
      window.open(this.props.local.assetURL, "_blank");
    }
  };
  public render() {
    return (
      <CommentsHistory
        me={this.props.me}
        goToConversation={this.goToConversation}
      />
    );
  }
}
const enhanced = withFragmentContainer<CommentsHistoryContainerProps>({
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
})(
  withLocalStateContainer(
    graphql`
      fragment CommentsHistoryContainerLocal on Local {
        assetURL
      }
    `
  )(CommentsHistoryContainer)
);

export default enhanced;
