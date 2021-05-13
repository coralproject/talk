import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Tombstone } from "coral-ui/components/v3";

import { RejectedTombstoneContainer_comment } from "coral-stream/__generated__/RejectedTombstoneContainer_comment.graphql";

interface Props {
  comment: RejectedTombstoneContainer_comment;
  children: React.ReactNode;
}

const RejectedTombstoneContainer: FunctionComponent<Props> = ({
  comment,
  children,
}) => {
  // Comment is not published after viewer rejected it.
  if (comment.status !== "REJECTED" || comment.lastViewerAction === "REJECT") {
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

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment RejectedTombstoneContainer_comment on Comment {
      status
      lastViewerAction
    }
  `,
})(RejectedTombstoneContainer);

export default enhanced;
