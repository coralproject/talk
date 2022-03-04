import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import CLASSES from "coral-stream/classes";
import { Tombstone } from "coral-ui/components/v3";

import { DeletedTombstoneContainer_comment$key as DeletedTombstoneContainer_comment } from "coral-stream/__generated__/DeletedTombstoneContainer_comment.graphql";

interface Props {
  comment: DeletedTombstoneContainer_comment;
  children: React.ReactNode;
}

const DeletedTombstoneContainer: FunctionComponent<Props> = ({
  comment,
  children,
}) => {
  const commentData = useFragment(
    graphql`
      fragment DeletedTombstoneContainer_comment on Comment {
        deleted
      }
    `,
    comment
  );

  if (!commentData.deleted) {
    return <>{children}</>;
  }
  return (
    <Tombstone className={CLASSES.deletedTombstone} fullWidth>
      <Localized id="comments-tombstone-deleted">
        This comment is no longer available. The commenter has deleted their
        account.
      </Localized>
    </Tombstone>
  );
};

export default DeletedTombstoneContainer;
