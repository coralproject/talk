import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { ModerationDropdownContainer_comment as CommentData } from "coral-stream/__generated__/ModerationDropdownContainer_comment.graphql";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  Icon,
} from "coral-ui/components";

import AcceptCommentMutation from "./AcceptCommentMutation";
import styles from "./ModerationDropdownContainer.css";
import RejectCommentMutation from "./RejectCommentMutation";

interface Props {
  comment: CommentData;
}

const ModerationDropdownContainer: FunctionComponent<Props> = ({ comment }) => {
  const accept = useMutation(AcceptCommentMutation);
  const reject = useMutation(RejectCommentMutation);

  const onAccept = useCallback(
    () =>
      accept({ commentID: comment.id, commentRevisionID: comment.revision.id }),
    [accept, comment]
  );
  const onReject = useCallback(
    () =>
      reject({ commentID: comment.id, commentRevisionID: comment.revision.id }),
    [accept, comment]
  );

  const accepted = comment.status === "ACCEPTED";
  const rejected = comment.status === "REJECTED";

  return (
    <Dropdown>
      {accepted ? (
        <Localized id="comments-moderationDropdown-approved">
          <DropdownButton
            icon={<Icon className={styles.approved}>check</Icon>}
            className={styles.approved}
            disabled
          >
            Approved
          </DropdownButton>
        </Localized>
      ) : (
        <Localized id="comments-moderationDropdown-approve">
          <DropdownButton icon={<Icon>check</Icon>} onClick={onAccept}>
            Approve
          </DropdownButton>
        </Localized>
      )}
      {rejected ? (
        <Localized id="comments-moderationDropdown-rejected">
          <DropdownButton
            icon={<Icon className={styles.rejected}>close</Icon>}
            className={styles.rejected}
            disabled
          >
            Rejected
          </DropdownButton>
        </Localized>
      ) : (
        <Localized id="comments-moderationDropdown-reject">
          <DropdownButton icon={<Icon>close</Icon>} onClick={onReject}>
            Reject
          </DropdownButton>
        </Localized>
      )}
      <DropdownDivider />
      <Localized id="comments-moderationDropdown-goToModerate">
        <DropdownButton
          href={`/admin/moderate/comment/${comment.id}`}
          target="_blank"
          anchor
        >
          Go to Moderate
        </DropdownButton>
      </Localized>
    </Dropdown>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ModerationDropdownContainer_comment on Comment {
      id
      revision {
        id
      }
      status
    }
  `,
})(ModerationDropdownContainer);

export default enhanced;
