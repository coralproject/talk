import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { DecisionHistoryItemContainer_action as ActionData } from "coral-admin/__generated__/DecisionHistoryItemContainer_action.graphql";

import ApprovedComment from "./ApprovedComment";
import RejectedComment from "./RejectedComment";

interface DecisionHistoryItemContainerProps {
  action: ActionData;
  onClosePopover: () => void;
}

class DecisionHistoryItemContainer extends React.Component<DecisionHistoryItemContainerProps> {
  public render() {
    // Comment might be deleted and null, because of database inconsistencies, handle this gracefully.
    const href = this.props.action.comment
      ? `/admin/moderate/comment/${this.props.action.comment.id}`
      : null;
    const username =
      (this.props.action.comment &&
        this.props.action.comment.author &&
        this.props.action.comment.author.username) ||
      "Unknown"; // TODO: (cvle) Figure out what to display, when username is not available.
    if (this.props.action.status === "APPROVED") {
      return (
        <ApprovedComment
          href={href}
          username={username}
          date={this.props.action.createdAt}
          onGotoComment={this.props.onClosePopover}
        />
      );
    } else if (this.props.action.status === "REJECTED") {
      return (
        <RejectedComment
          href={href}
          username={username}
          date={this.props.action.createdAt}
          onGotoComment={this.props.onClosePopover}
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
      comment {
        id
        author {
          username
        }
      }
      createdAt
      status
    }
  `,
})(DecisionHistoryItemContainer);

export default enhanced;
