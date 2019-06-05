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

import ApproveCommentMutation from "./ApproveCommentMutation";
import FeatureCommentMutation from "./FeatureCommentMutation";
import RejectCommentMutation from "./RejectCommentMutation";
import UnfeatureCommentMutation from "./UnfeatureCommentMutation";

import styles from "./ModerationDropdownContainer.css";

interface Props {
  comment: CommentData;
  onDismiss: () => void;
}

const ModerationDropdownContainer: FunctionComponent<Props> = ({
  comment,
  onDismiss,
}) => {
  const approve = useMutation(ApproveCommentMutation);
  const feature = useMutation(FeatureCommentMutation);
  const unfeature = useMutation(UnfeatureCommentMutation);
  const reject = useMutation(RejectCommentMutation);

  const onApprove = useCallback(() => {
    approve({ commentID: comment.id, commentRevisionID: comment.revision.id });
  }, [approve, comment]);
  const onReject = useCallback(
    () =>
      reject({ commentID: comment.id, commentRevisionID: comment.revision.id }),
    [approve, comment]
  );
  const onFeature = useCallback(() => {
    feature({ commentID: comment.id, commentRevisionID: comment.revision.id });
    onDismiss();
  }, [feature, comment]);
  const onUnfeature = useCallback(() => {
    unfeature({
      commentID: comment.id,
    });
    onDismiss();
  }, [unfeature, comment]);

  const approved = comment.status === "APPROVED";
  const rejected = comment.status === "REJECTED";
  const featured = comment.tags.some(t => t.code === "FEATURED");

  return (
    <Dropdown>
      {featured ? (
        <Localized id="comments-moderationDropdown-unfeature">
          <DropdownButton
            icon={
              <Icon className={styles.featured} size="md">
                star
              </Icon>
            }
            className={styles.featured}
            onClick={onUnfeature}
          >
            Un-Feature
          </DropdownButton>
        </Localized>
      ) : (
        <Localized id="comments-moderationDropdown-feature">
          <DropdownButton
            icon={<Icon size="md">star_border</Icon>}
            onClick={onFeature}
          >
            Feature
          </DropdownButton>
        </Localized>
      )}
      {approved ? (
        <Localized id="comments-moderationDropdown-approved">
          <DropdownButton
            icon={
              <Icon className={styles.approved} size="md">
                check
              </Icon>
            }
            className={styles.approved}
            disabled
          >
            Approved
          </DropdownButton>
        </Localized>
      ) : (
        <Localized id="comments-moderationDropdown-approve">
          <DropdownButton
            icon={<Icon size="md">check</Icon>}
            onClick={onApprove}
          >
            Approve
          </DropdownButton>
        </Localized>
      )}
      {rejected ? (
        <Localized id="comments-moderationDropdown-rejected">
          <DropdownButton
            icon={
              <Icon className={styles.rejected} size="md">
                close
              </Icon>
            }
            className={styles.rejected}
            disabled
          >
            Rejected
          </DropdownButton>
        </Localized>
      ) : (
        <Localized id="comments-moderationDropdown-reject">
          <DropdownButton
            icon={<Icon size="md">close</Icon>}
            onClick={onReject}
          >
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
      tags {
        code
      }
    }
  `,
})(ModerationDropdownContainer);

export default enhanced;
