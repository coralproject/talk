import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { ModerationActionsContainer_comment } from "coral-stream/__generated__/ModerationActionsContainer_comment.graphql";
import { ModerationActionsContainer_story } from "coral-stream/__generated__/ModerationActionsContainer_story.graphql";

import { DropdownButton, DropdownDivider, Icon } from "coral-ui/components";

import ApproveCommentMutation from "./ApproveCommentMutation";
import FeatureCommentMutation from "./FeatureCommentMutation";
import RejectCommentMutation from "./RejectCommentMutation";
import UnfeatureCommentMutation from "./UnfeatureCommentMutation";

import styles from "./ModerationActionsContainer.css";

interface Props {
  comment: ModerationActionsContainer_comment;
  story: ModerationActionsContainer_story;
  onDismiss: () => void;
  onBan: () => void;
}

const ModerationActionsContainer: FunctionComponent<Props> = ({
  comment,
  story,
  onDismiss,
  onBan,
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
    feature({
      storyID: story.id,
      commentID: comment.id,
      commentRevisionID: comment.revision.id,
    });
    onDismiss();
  }, [feature, comment]);
  const onUnfeature = useCallback(() => {
    unfeature({
      commentID: comment.id,
      storyID: story.id,
    });
    onDismiss();
  }, [unfeature, comment]);
  const approved = comment.status === "APPROVED";
  const rejected = comment.status === "REJECTED";
  const featured = comment.tags.some(t => t.code === "FEATURED");

  return (
    <>
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
      <Localized id="comments-moderationDropdown-ban">
        <DropdownButton
          icon={
            <div className={styles.banIcon}>
              <Icon size="sm">block</Icon>
            </div>
          }
          onClick={onBan}
        >
          Ban User
        </DropdownButton>
      </Localized>
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
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ModerationActionsContainer_comment on Comment {
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
  story: graphql`
    fragment ModerationActionsContainer_story on Story {
      id
    }
  `,
})(ModerationActionsContainer);

export default enhanced;
