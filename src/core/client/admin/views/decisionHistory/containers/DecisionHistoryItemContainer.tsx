import React from "react";
import { graphql } from "react-relay";

import { DecisionHistoryItemContainer_action as ActionData } from "talk-admin/__generated__/DecisionHistoryItemContainer_action.graphql";
import { withFragmentContainer } from "talk-framework/lib/relay";

import AcceptedComment from "../components/AcceptedComment";
import RejectedComment from "../components/RejectedComment";

interface DecisionHistoryItemContainerProps {
  action: ActionData;
  onClosePopover: () => void;
}

class DecisionHistoryItemContainer extends React.Component<
  DecisionHistoryItemContainerProps
> {
  public render() {
    const href = `/admin/moderate/comment/${
      this.props.action.revision.comment.id
    }`;
    const username =
      (this.props.action.revision.comment.author &&
        this.props.action.revision.comment.author.username) ||
      "Unknown"; // TODO: (cvle) Figure out what to display, when username is not available.
    if (this.props.action.status === "ACCEPTED") {
      return (
        <AcceptedComment
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
      revision {
        id
        comment {
          id
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
