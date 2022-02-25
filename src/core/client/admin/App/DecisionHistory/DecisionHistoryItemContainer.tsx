import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { DecisionHistoryItemContainer_action$key as ActionData } from "coral-admin/__generated__/DecisionHistoryItemContainer_action.graphql";

import ApprovedComment from "./ApprovedComment";
import RejectedComment from "./RejectedComment";

interface DecisionHistoryItemContainerProps {
  action: ActionData;
  onClosePopover: () => void;
}

const DecisionHistoryItemContainer: FunctionComponent<DecisionHistoryItemContainerProps> = ({
  action,
  onClosePopover,
}) => {
  const actionData = useFragment(
    graphql`
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
    action
  );

  // Comment might be deleted and null, because of database inconsistencies, handle this gracefully.
  const href = actionData.comment
    ? `/admin/moderate/comment/${actionData.comment.id}`
    : null;

  const username =
    (actionData.comment &&
      actionData.comment.author &&
      actionData.comment.author.username) ||
    "Unknown"; // TODO: (cvle) Figure out what to display, when username is not available.

  if (actionData.status === "APPROVED") {
    return (
      <ApprovedComment
        href={href}
        username={username}
        date={actionData.createdAt}
        onGotoComment={onClosePopover}
      />
    );
  } else if (actionData.status === "REJECTED") {
    return (
      <RejectedComment
        href={href}
        username={username}
        date={actionData.createdAt}
        onGotoComment={onClosePopover}
      />
    );
  }
  return null;
};

export default DecisionHistoryItemContainer;
