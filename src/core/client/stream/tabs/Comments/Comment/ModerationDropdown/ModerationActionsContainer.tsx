import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useViewerEvent } from "coral-framework/lib/events";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLSTORY_MODE } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import { GotoModerationEvent } from "coral-stream/events";
import { DropdownButton, DropdownDivider, Icon } from "coral-ui/components/v2";

import { ModerationActionsContainer_comment } from "coral-stream/__generated__/ModerationActionsContainer_comment.graphql";
import { ModerationActionsContainer_story } from "coral-stream/__generated__/ModerationActionsContainer_story.graphql";
import { ModerationActionsContainer_viewer } from "coral-stream/__generated__/ModerationActionsContainer_viewer.graphql";

import ApproveCommentMutation from "./ApproveCommentMutation";
import FeatureCommentMutation from "./FeatureCommentMutation";
import ModerationActionBanQuery from "./ModerationActionBanQuery";
import RejectCommentMutation from "./RejectCommentMutation";
import UnfeatureCommentMutation from "./UnfeatureCommentMutation";

import styles from "./ModerationActionsContainer.css";

interface Props {
  comment: ModerationActionsContainer_comment;
  story: ModerationActionsContainer_story;
  viewer: ModerationActionsContainer_viewer;
  onDismiss: () => void;
  onBan: () => void;
}

const ModerationActionsContainer: FunctionComponent<Props> = ({
  comment,
  story,
  viewer,
  onDismiss,
  onBan,
}) => {
  const emitGotoModerationEvent = useViewerEvent(GotoModerationEvent);
  const approve = useMutation(ApproveCommentMutation);
  const feature = useMutation(FeatureCommentMutation);
  const unfeature = useMutation(UnfeatureCommentMutation);
  const reject = useMutation(RejectCommentMutation);

  const onGotoModerate = useCallback(() => {
    emitGotoModerationEvent({ commentID: comment.id });
  }, [emitGotoModerationEvent, comment.id]);

  const onApprove = useCallback(() => {
    if (!comment.revision) {
      return;
    }
    approve({ commentID: comment.id, commentRevisionID: comment.revision.id });
  }, [approve, comment]);
  const onReject = useCallback(async () => {
    if (!comment.revision) {
      return;
    }
    await reject({
      commentID: comment.id,
      commentRevisionID: comment.revision.id,
      storyID: story.id,
    });
  }, [approve, comment, story]);
  const onFeature = useCallback(() => {
    if (!comment.revision) {
      return;
    }
    feature({
      storyID: story.id,
      commentID: comment.id,
      commentRevisionID: comment.revision.id,
    });
    onDismiss();
  }, [feature, onDismiss, story, comment]);
  const onUnfeature = useCallback(() => {
    unfeature({
      commentID: comment.id,
      storyID: story.id,
    });
    onDismiss();
  }, [unfeature, onDismiss, story, comment]);
  const approved = comment.status === "APPROVED";
  const rejected = comment.status === "REJECTED";
  const featured = comment.tags.some((t) => t.code === "FEATURED");
  const showBanOption =
    !comment.author || !comment.author.id || viewer === null
      ? false
      : comment.author.id !== viewer.id;
  const isQA = story.settings.mode === GQLSTORY_MODE.QA;

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
            className={cn(
              styles.label,
              styles.featured,
              CLASSES.moderationDropdown.unfeatureButton
            )}
            onClick={onUnfeature}
            disabled={isQA}
          >
            Un-Feature
          </DropdownButton>
        </Localized>
      ) : (
        <Localized id="comments-moderationDropdown-feature">
          <DropdownButton
            className={cn(
              styles.label,
              CLASSES.moderationDropdown.featureButton
            )}
            icon={<Icon size="md">star_border</Icon>}
            onClick={onFeature}
            disabled={isQA}
          >
            Feature
          </DropdownButton>
        </Localized>
      )}
      {approved ? (
        <Localized id="comments-moderationDropdown-approved">
          <DropdownButton
            icon={
              <Icon
                className={cn(styles.approveIcon, styles.approved)}
                size="md"
              >
                check
              </Icon>
            }
            className={cn(
              styles.label,
              styles.approved,
              CLASSES.moderationDropdown.approvedButton
            )}
            disabled
          >
            Approved
          </DropdownButton>
        </Localized>
      ) : (
        <Localized id="comments-moderationDropdown-approve">
          <DropdownButton
            className={(styles.label, CLASSES.moderationDropdown.approveButton)}
            icon={
              <Icon size="md" className={styles.approveIcon}>
                check
              </Icon>
            }
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
              <Icon
                className={cn(styles.rejectIcon, styles.rejected)}
                size="md"
              >
                close
              </Icon>
            }
            className={cn(
              styles.label,
              styles.rejected,
              CLASSES.moderationDropdown.rejectedButton
            )}
            disabled
          >
            Rejected
          </DropdownButton>
        </Localized>
      ) : (
        <Localized id="comments-moderationDropdown-reject">
          <DropdownButton
            icon={
              <Icon size="md" className={styles.rejectIcon}>
                close
              </Icon>
            }
            onClick={onReject}
            className={cn(
              styles.label,
              CLASSES.moderationDropdown.rejectButton
            )}
          >
            Reject
          </DropdownButton>
        </Localized>
      )}
      {showBanOption && (
        <>
          <DropdownDivider />
          <ModerationActionBanQuery onBan={onBan} userID={comment.author!.id} />
        </>
      )}
      <DropdownDivider />
      <Localized id="comments-moderationDropdown-goToModerate">
        <DropdownButton
          className={CLASSES.moderationDropdown.goToModerateButton}
          href={`/admin/moderate/comment/${comment.id}`}
          target="_blank"
          onClick={onGotoModerate}
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
      author {
        id
      }
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
      settings {
        mode
      }
    }
  `,
  viewer: graphql`
    fragment ModerationActionsContainer_viewer on User {
      id
    }
  `,
})(ModerationActionsContainer);

export default enhanced;
