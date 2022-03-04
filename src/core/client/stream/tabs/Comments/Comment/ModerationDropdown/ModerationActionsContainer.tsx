import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { graphql, useFragment } from "react-relay";

import { getModerationLink } from "coral-framework/helpers";
import { useViewerEvent } from "coral-framework/lib/events";
import { useLocal, useMutation } from "coral-framework/lib/relay";
import { GQLSTORY_MODE } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import { GotoModerationEvent } from "coral-stream/events";
import { DropdownButton, DropdownDivider, Icon } from "coral-ui/components/v2";

import { ModerationActionsContainer_comment$key as ModerationActionsContainer_comment } from "coral-stream/__generated__/ModerationActionsContainer_comment.graphql";
import { ModerationActionsContainer_local } from "coral-stream/__generated__/ModerationActionsContainer_local.graphql";
import { ModerationActionsContainer_settings$key as ModerationActionsContainer_settings } from "coral-stream/__generated__/ModerationActionsContainer_settings.graphql";
import { ModerationActionsContainer_story$key as ModerationActionsContainer_story } from "coral-stream/__generated__/ModerationActionsContainer_story.graphql";
import { ModerationActionsContainer_viewer$key as ModerationActionsContainer_viewer } from "coral-stream/__generated__/ModerationActionsContainer_viewer.graphql";

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
  settings: ModerationActionsContainer_settings;
  onDismiss: () => void;
  onBan: () => void;
}

const ModerationActionsContainer: FunctionComponent<Props> = ({
  comment,
  story,
  viewer,
  settings,
  onDismiss,
  onBan,
}) => {
  const commentData = useFragment(
    graphql`
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
    comment
  );
  const settingsData = useFragment(
    graphql`
      fragment ModerationActionsContainer_settings on Settings {
        auth {
          integrations {
            sso {
              enabled
              targetFilter {
                admin
              }
            }
          }
        }
      }
    `,
    settings
  );
  const storyData = useFragment(
    graphql`
      fragment ModerationActionsContainer_story on Story {
        id
        settings {
          mode
        }
      }
    `,
    story
  );
  const viewerData = useFragment(
    graphql`
      fragment ModerationActionsContainer_viewer on User {
        id
        moderationScopes {
          scoped
        }
      }
    `,
    viewer
  );

  const [{ accessToken }] = useLocal<ModerationActionsContainer_local>(graphql`
    fragment ModerationActionsContainer_local on Local {
      accessToken
    }
  `);

  const emitGotoModerationEvent = useViewerEvent(GotoModerationEvent);
  const approve = useMutation(ApproveCommentMutation);
  const feature = useMutation(FeatureCommentMutation);
  const unfeature = useMutation(UnfeatureCommentMutation);
  const reject = useMutation(RejectCommentMutation);

  const moderationLinkSuffix =
    !!accessToken &&
    settingsData.auth.integrations.sso.enabled &&
    settingsData.auth.integrations.sso.targetFilter.admin &&
    `#accessToken=${accessToken}`;

  const gotoModerateStoryHref = useMemo(() => {
    let link = getModerationLink({ storyID: storyData.id });
    if (moderationLinkSuffix) {
      link += moderationLinkSuffix;
    }

    return link;
  }, [storyData.id, moderationLinkSuffix]);

  const gotoModerateCommentHref = useMemo(() => {
    let link = getModerationLink({ commentID: commentData.id });
    if (moderationLinkSuffix) {
      link += moderationLinkSuffix;
    }

    return link;
  }, [commentData.id, moderationLinkSuffix]);

  const onGotoModerate = useCallback(() => {
    emitGotoModerationEvent({ commentID: commentData.id });
  }, [emitGotoModerationEvent, commentData.id]);

  const onApprove = useCallback(() => {
    if (!commentData.revision) {
      return;
    }
    void approve({
      commentID: commentData.id,
      commentRevisionID: commentData.revision.id,
    });
  }, [approve, commentData]);
  const onReject = useCallback(async () => {
    if (!commentData.revision) {
      return;
    }
    await reject({
      commentID: commentData.id,
      commentRevisionID: commentData.revision.id,
      storyID: storyData.id,
    });
  }, [commentData.id, commentData.revision, reject, storyData.id]);
  const onFeature = useCallback(() => {
    if (!commentData.revision) {
      return;
    }
    void feature({
      storyID: storyData.id,
      commentID: commentData.id,
      commentRevisionID: commentData.revision.id,
    });
    onDismiss();
  }, [feature, onDismiss, storyData, commentData]);
  const onUnfeature = useCallback(() => {
    void unfeature({
      commentID: commentData.id,
      storyID: storyData.id,
    });
    onDismiss();
  }, [unfeature, onDismiss, storyData, commentData]);
  const approved = commentData.status === "APPROVED";
  const rejected = commentData.status === "REJECTED";
  const featured = commentData.tags.some((t) => t.code === "FEATURED");
  const showBanOption =
    !commentData.author || !commentData.author.id || viewerData === null
      ? false
      : commentData.author.id !== viewerData.id &&
        !viewerData.moderationScopes?.scoped;
  const isQA = storyData.settings.mode === GQLSTORY_MODE.QA;

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
            className={cn(CLASSES.moderationDropdown.unfeatureButton)}
            classes={{
              root: cn(styles.label, styles.featured),
              mouseHover: styles.mouseHover,
            }}
            onClick={onUnfeature}
            disabled={isQA}
          >
            Un-Feature
          </DropdownButton>
        </Localized>
      ) : (
        <Localized id="comments-moderationDropdown-feature">
          <DropdownButton
            className={cn(CLASSES.moderationDropdown.featureButton)}
            classes={{
              root: styles.label,
              mouseHover: styles.mouseHover,
            }}
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
            className={cn(CLASSES.moderationDropdown.approvedButton)}
            classes={{
              root: cn(styles.label, styles.approved),
              mouseHover: styles.mouseHover,
            }}
            disabled
          >
            Approved
          </DropdownButton>
        </Localized>
      ) : (
        <Localized id="comments-moderationDropdown-approve">
          <DropdownButton
            className={CLASSES.moderationDropdown.approveButton}
            classes={{
              root: styles.label,
              mouseHover: styles.mouseHover,
            }}
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
            classes={{
              mouseHover: styles.mouseHover,
            }}
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
            classes={{
              mouseHover: styles.mouseHover,
            }}
          >
            Reject
          </DropdownButton>
        </Localized>
      )}
      {showBanOption && (
        <>
          <DropdownDivider />
          <ModerationActionBanQuery
            onBan={onBan}
            userID={commentData.author!.id}
          />
        </>
      )}
      <DropdownDivider />
      <Localized id="comments-moderationDropdown-moderationView">
        <DropdownButton
          className={CLASSES.moderationDropdown.goToModerateButton}
          classes={{
            anchor: styles.link,
            iconOpenInNew: styles.linkIcon,
            mouseHover: styles.mouseHover,
          }}
          href={gotoModerateCommentHref}
          target="_blank"
          onClick={onGotoModerate}
          anchor
        >
          Moderation view
        </DropdownButton>
      </Localized>
      <Localized id="comments-moderationDropdown-moderateStory">
        <DropdownButton
          className={CLASSES.moderationDropdown.goToModerateButton}
          classes={{
            anchor: styles.link,
            iconOpenInNew: styles.linkIcon,
            mouseHover: styles.mouseHover,
          }}
          href={gotoModerateStoryHref}
          target="_blank"
          onClick={onGotoModerate}
          anchor
        >
          Moderate story
        </DropdownButton>
      </Localized>
    </>
  );
};

export default ModerationActionsContainer;
