import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Tombstone } from "coral-ui/components/v3";

import { DeletedTombstoneContainer_comment } from "coral-stream/__generated__/DeletedTombstoneContainer_comment.graphql";

import computeCommentElementID from "./Comment/computeCommentElementID";

interface Props {
  comment: DeletedTombstoneContainer_comment;
  children: React.ReactNode;
}

const DeletedTombstoneContainer: FunctionComponent<Props> = ({
  comment,
  children,
}) => {
  if (!comment.deleted) {
    return <>{children}</>;
  }
  // commentElementID is added here to support keyboard shortcuts.
  const commentElementID = computeCommentElementID(comment.id);
  return (
    <Tombstone
      className={CLASSES.deletedTombstone}
      fullWidth
      id={commentElementID}
    >
      <Localized id="comments-tombstone-deleted">
        This comment is no longer available. The commenter has deleted their
        account.
      </Localized>
    </Tombstone>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment DeletedTombstoneContainer_comment on Comment {
      deleted
      id
    }
  `,
})(DeletedTombstoneContainer);

export default enhanced;
