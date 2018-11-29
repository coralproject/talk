import React from "react";
import { graphql } from "react-relay";

import { DecisionHistoryItemContainer_action as ActionData } from "talk-admin/__generated__/DecisionHistoryItemContainer_action.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";

import AcceptedComment from "../components/AcceptedComment";
import RejectedComment from "../components/RejectedComment";

interface DecisionHistoryItemContainerProps {
  action: ActionData;
}

class DecisionHistoryItemContainer extends React.Component<
  DecisionHistoryItemContainerProps
> {
  private handleGoToComment = (e: React.MouseEvent) => {
    return;
  };
  public render() {
    if (this.props.action.status === "ACCEPTED") {
      return (
        <AcceptedComment
          href="#"
          username={this.props.action.revision.comment.author!.username!}
          date={this.props.action.createdAt}
          onGotoComment={this.handleGoToComment}
        />
      );
    } else if (this.props.action.status === "REJECTED") {
      return (
        <RejectedComment
          href="#"
          username={this.props.action.revision.comment.author!.username!}
          date={this.props.action.createdAt}
          onGotoComment={this.handleGoToComment}
        />
      );
    }
    return null;
  }
}

const enhanced = withFragmentContainer<DecisionHistoryItemContainerProps>({
  action: graphql`
    fragment DecisionHistoryItemContainer_action on CommentModerationAction {
      id
      revision {
        id
        comment {
          author {
            username
          }
        }
      }
      createdAt
      status
    }
  `,
})(DecisionHistoryItemContainer);

export default enhanced;
