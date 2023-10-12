/* eslint-disable */
import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, {
  FunctionComponent,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { graphql } from "react-relay";

import { useModerationLink } from "coral-framework/hooks";
import { useViewerEvent } from "coral-framework/lib/events";
import {
  useLocal,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLSTORY_MODE } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import { GotoModerationEvent } from "coral-stream/events";
import {
  CheckIcon,
  RatingStarIcon,
  RemoveIcon,
  SvgIcon,
} from "coral-ui/components/icons";
import { DropdownButton, DropdownDivider } from "coral-ui/components/v2";

import ModerationReason from "coral-admin/components/ModerationReason/ModerationReason";

import { ModerationActionsContainer_comment } from "coral-stream/__generated__/ModerationActionsContainer_comment.graphql";
import { ModerationActionsContainer_local } from "coral-stream/__generated__/ModerationActionsContainer_local.graphql";
import { ModerationActionsContainer_settings } from "coral-stream/__generated__/ModerationActionsContainer_settings.graphql";
import { ModerationActionsContainer_story } from "coral-stream/__generated__/ModerationActionsContainer_story.graphql";
import { ModerationActionsContainer_viewer } from "coral-stream/__generated__/ModerationActionsContainer_viewer.graphql";
import { ModerationActionsContainerLocal } from "coral-stream/__generated__/ModerationActionsContainerLocal.graphql";

import ApproveCommentMutation from "./ApproveCommentMutation";
import CopyCommentEmbedCodeContainer from "./CopyCommentEmbedCodeContainer";
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
  onSiteBan: () => void;
}

interface RejectState {
  showModerationReason: boolean;
  rejecting: boolean;
}

type RejectAction =
  | "INDICATE_REJECT"
  | "CONFIRM_REJECT_REASON"
  | "REJECT_COMPLETE";

type RejectionReducer = Reducer<RejectState, RejectAction>;

const ModerationActionsContainer: FunctionComponent<Props> = ({
  comment,
  story,
  viewer,
  settings,
  onDismiss,
  onBan,
  onSiteBan,
}) => {
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

  const linkModerateStory = useModerationLink({ storyID: story.id });
  const linkModerateComment = useModerationLink({ commentID: comment.id });

  const [{ dsaFeaturesEnabled }] =
    useLocal<ModerationActionsContainerLocal>(graphql`
      fragment ModerationActionsContainerLocal on Local {
        dsaFeaturesEnabled
      }
    `);

  const [{ showModerationReason, rejecting }, dispatch] =
    useReducer<RejectionReducer>(
      (state, action) => {
        console.log("an action was dispatched", action);
        switch (action) {
          case "REJECT_COMPLETE":
            return { rejecting: false, showModerationReason: false };
          case "CONFIRM_REJECT_REASON":
            return { rejecting: true, showModerationReason: false };
          case "INDICATE_REJECT":
            return dsaFeaturesEnabled
              ? { showModerationReason: true, rejecting: false }
              : { showModerationReason: false, rejecting: true };
        }
      },
      {
        showModerationReason: false,
        rejecting: false,
      }
    );

  const moderationLinkSuffix =
    !!accessToken &&
    settings.auth.integrations.sso.enabled &&
    settings.auth.integrations.sso.targetFilter.admin &&
    `#accessToken=${accessToken}`;

  const gotoModerateStoryHref = useMemo(() => {
    let ret = linkModerateStory;
    if (moderationLinkSuffix) {
      ret += moderationLinkSuffix;
    }

    return ret;
  }, [linkModerateStory, moderationLinkSuffix]);

  const gotoModerateCommentHref = useMemo(() => {
    let ret = linkModerateComment;
    if (moderationLinkSuffix) {
      ret += moderationLinkSuffix;
    }

    return ret;
  }, [linkModerateComment, moderationLinkSuffix]);

  const onGotoModerate = useCallback(() => {
    emitGotoModerationEvent({ commentID: comment.id });
  }, [emitGotoModerationEvent, comment.id]);

  const onApprove = useCallback(() => {
    if (!comment.revision) {
      return;
    }
    void approve({
      commentID: comment.id,
      commentRevisionID: comment.revision.id,
    });
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
  }, [comment, story, reject]);
  const onFeature = useCallback(() => {
    if (!comment.revision) {
      return;
    }
    void feature({
      storyID: story.id,
      commentID: comment.id,
      commentRevisionID: comment.revision.id,
    });
    onDismiss();
  }, [feature, onDismiss, story, comment]);
  const onUnfeature = useCallback(() => {
    void unfeature({
      commentID: comment.id,
      storyID: story.id,
    });
    onDismiss();
  }, [unfeature, onDismiss, story, comment]);

  useEffect(() => {
    if (rejecting) {
      void onReject();
    }
  }, [rejecting, onReject]);

  const approved = comment.status === "APPROVED";
  const rejected = comment.status === "REJECTED";
  const featured = comment.tags.some((t) => t.code === "FEATURED");
  const showBanOption =
    !comment.author || !comment.author.id || viewer === null
      ? false
      : comment.author.id !== viewer.id;
  const isQA = story.settings.mode === GQLSTORY_MODE.QA;

  const showCopyCommentEmbed = !!comment.body;


  console.log("SHOWING MODAL?",
  JSON.stringify({ dsaFeaturesEnabled, showModerationReason }, null, 2));

  return (
    <>
      {featured ? (
        <Localized id="comments-moderationDropdown-unfeature">
          <DropdownButton
            icon={
              <SvgIcon
                className={styles.featured}
                filled
                Icon={RatingStarIcon}
              />
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
            icon={<SvgIcon Icon={RatingStarIcon} />}
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
              <SvgIcon
                className={cn(styles.approveIcon, styles.approved)}
                Icon={CheckIcon}
              />
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
            icon={<SvgIcon Icon={CheckIcon} className={styles.approveIcon} />}
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
              <SvgIcon
                Icon={RemoveIcon}
                className={cn(styles.rejectIcon, styles.rejected)}
              />
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
            icon={<SvgIcon Icon={RemoveIcon} className={styles.rejectIcon} />}
            onClick={() => dispatch("INDICATE_REJECT")}
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
          <ModerationActionBanQuery
            onBan={onBan}
            onSiteBan={onSiteBan}
            userID={comment.author!.id}
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
      {showCopyCommentEmbed && (
        <CopyCommentEmbedCodeContainer
          comment={comment}
          settings={settings}
          story={story}
        />
      )}
      {dsaFeaturesEnabled && <ModerationReason onReason={(reason) => console.log("TODO: reject from stream")} open={showModerationReason} />}
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
      body
      revision {
        id
      }
      status
      tags {
        code
      }
      ...CopyCommentEmbedCodeContainer_comment
    }
  `,
  settings: graphql`
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
      ...CopyCommentEmbedCodeContainer_settings
    }
  `,
  story: graphql`
    fragment ModerationActionsContainer_story on Story {
      id
      settings {
        mode
      }
      ...CopyCommentEmbedCodeContainer_story
    }
  `,
  viewer: graphql`
    fragment ModerationActionsContainer_viewer on User {
      id
    }
  `,
})(ModerationActionsContainer);

export default enhanced;
