import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import CLASSES from "coral-stream/classes";
import { Tombstone } from "coral-ui/components/v3";

import { RejectedTombstoneContainer_comment$key as RejectedTombstoneContainer_comment } from "coral-stream/__generated__/RejectedTombstoneContainer_comment.graphql";

interface Props {
  comment: RejectedTombstoneContainer_comment;
  children: React.ReactNode;
}

const RejectedTombstoneContainer: FunctionComponent<Props> = ({
  comment,
  children,
}) => {
  const commentData = useFragment(
    graphql`
      fragment RejectedTombstoneContainer_comment on Comment {
        status
        lastViewerAction
      }
    `,
    comment
  );

  // Comment is not published after viewer rejected it.
  if (
    commentData.status !== "REJECTED" ||
    commentData.lastViewerAction === "REJECT"
  ) {
    return <>{children}</>;
  }
  return (
    <Tombstone className={CLASSES.rejectedTombstone} fullWidth>
      <Localized id="comments-tombstone-rejected">
        This commenter has been removed by a moderator for violating our
        community guidelines.
      </Localized>
    </Tombstone>
  );
};

export default RejectedTombstoneContainer;
