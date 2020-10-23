import { Match, Router, withRouter } from "found";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { graphql } from "react-relay";

import NotAvailable from "coral-admin/components/NotAvailable";
import BanModal from "coral-admin/components/UserStatus/BanModal";
import {
  ApproveCommentMutation,
  RejectCommentMutation,
} from "coral-admin/mutations";
import FadeInTransition from "coral-framework/components/FadeInTransition";
import { getModerationLink } from "coral-framework/helpers";
import parseModerationOptions from "coral-framework/helpers/parseModerationOptions";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import {
  GQLFEATURE_FLAG,
  GQLSTORY_MODE,
  GQLTAG,
  GQLUSER_ROLE,
  GQLUSER_STATUS,
} from "coral-framework/schema";

import {
  COMMENT_STATUS,
  ModerateCardContainer_comment,
} from "coral-admin/__generated__/ModerateCardContainer_comment.graphql";
import { ModerateCardContainer_settings } from "coral-admin/__generated__/ModerateCardContainer_settings.graphql";
import { ModerateCardContainer_viewer } from "coral-admin/__generated__/ModerateCardContainer_viewer.graphql";

import BanCommentUserMutation from "./BanCommentUserMutation";
import FeatureCommentMutation from "./FeatureCommentMutation";
import ModerateCard from "./ModerateCard";
import ModeratedByContainer from "./ModeratedByContainer";
import UnfeatureCommentMutation from "./UnfeatureCommentMutation";

interface Props {
  viewer: ModerateCardContainer_viewer;
  comment: ModerateCardContainer_comment;
  settings: ModerateCardContainer_settings;
  danglingLogic: (status: COMMENT_STATUS) => boolean;
  match: Match;
  router: Router;
  showStoryInfo: boolean;
  mini?: boolean;
  hideUsername?: boolean;
  onUsernameClicked?: (userID: string) => void;
  onConversationClicked?: (commentID: string) => void;
  onSetSelected?: () => void;
  selected?: boolean;
  selectPrev?: () => void;
  selectNext?: () => void;
  loadNext?: (() => void) | null;
}

function getStatus(comment: ModerateCardContainer_comment) {
  switch (comment.status) {
    case "APPROVED":
      return "approved";
    case "REJECTED":
      return "rejected";
    default:
      return "undecided";
  }
}

function isFeatured(comment: ModerateCardContainer_comment) {
  return comment.tags.some((t) => t.code === GQLTAG.FEATURED);
}

const ModerateCardContainer: FunctionComponent<Props> = ({
  comment,
  settings,
  viewer,
  danglingLogic,
  showStoryInfo,
  match,
  router,
  mini,
  hideUsername,
  selected,
  selectPrev,
  selectNext,
  onUsernameClicked: usernameClicked,
  onConversationClicked: conversationClicked,
  onSetSelected: setSelected,
  loadNext,
}) => {
  const approveComment = useMutation(ApproveCommentMutation);
  const rejectComment = useMutation(RejectCommentMutation);
  const featureComment = useMutation(FeatureCommentMutation);
  const unfeatureComment = useMutation(UnfeatureCommentMutation);
  const banUser = useMutation(BanCommentUserMutation);

  const scoped = useMemo(
    () =>
      settings.featureFlags.includes(GQLFEATURE_FLAG.SITE_MODERATOR) &&
      !!viewer.moderationScopes?.scoped,
    [settings, viewer]
  );

  const readOnly = useMemo(() => scoped && !comment.canModerate, [
    scoped,
    comment,
  ]);

  const [showBanModal, setShowBanModal] = useState(false);
  const handleApprove = useCallback(async () => {
    if (!comment.revision) {
      return;
    }

    if (readOnly) {
      return;
    }

    const { storyID, siteID, section } = parseModerationOptions(match);

    await approveComment({
      commentID: comment.id,
      commentRevisionID: comment.revision.id,
      storyID,
      siteID,
      section,
    });
    if (loadNext) {
      loadNext();
    }
  }, [approveComment, comment.id, comment.revision, loadNext, match, readOnly]);

  const handleReject = useCallback(async () => {
    if (!comment.revision) {
      return;
    }

    if (readOnly) {
      return;
    }

    const { storyID, siteID, section } = parseModerationOptions(match);

    await rejectComment({
      commentID: comment.id,
      commentRevisionID: comment.revision.id,
      storyID,
      siteID,
      section,
    });
    if (loadNext) {
      loadNext();
    }
  }, [comment.revision, comment.id, readOnly, match, rejectComment, loadNext]);

  const handleFeature = useCallback(() => {
    if (!comment.revision) {
      return;
    }

    if (readOnly) {
      return;
    }

    const { storyID, siteID, section } = parseModerationOptions(match);

    void featureComment({
      commentID: comment.id,
      commentRevisionID: comment.revision.id,
      storyID,
      siteID,
      section,
    });
  }, [featureComment, comment, match, readOnly]);

  const handleUnfeature = useCallback(() => {
    if (readOnly) {
      return;
    }

    void unfeatureComment({
      commentID: comment.id,
      storyID: match.params.storyID,
    });
  }, [unfeatureComment, comment, match, readOnly]);

  const onFeature = useCallback(() => {
    if (readOnly) {
      return;
    }

    const featured = isFeatured(comment);
    if (featured) {
      handleUnfeature();
    } else {
      handleFeature();
    }
  }, [comment, readOnly, handleFeature, handleUnfeature]);

  const onUsernameClicked = useCallback(
    (id?: string) => {
      if (!usernameClicked) {
        return;
      }
      usernameClicked(id || comment.author!.id);
    },
    [usernameClicked, comment]
  );

  const onConversationClicked = useCallback(() => {
    if (!conversationClicked) {
      return;
    }
    conversationClicked(comment.id);
  }, [conversationClicked, comment]);

  const handleModerateStory = useCallback(
    (e: React.MouseEvent) => {
      router.push(getModerationLink({ storyID: comment.story.id }));
      if (e.preventDefault) {
        e.preventDefault();
      }
    },
    [router, comment]
  );

  const onFocusOrClick = useCallback(() => {
    if (setSelected) {
      setSelected();
    }
  }, [setSelected]);

  const handleBanModalClose = useCallback(() => {
    setShowBanModal(false);
  }, [setShowBanModal]);

  const openBanModal = useCallback(() => {
    if (
      !comment.author ||
      comment.author.status.current.includes(GQLUSER_STATUS.BANNED)
    ) {
      return;
    }

    setShowBanModal(true);
  }, [comment, setShowBanModal]);

  const handleBanConfirm = useCallback(
    async (
      rejectExistingComments: boolean,
      message: string,
      siteIDs: string[] | null | undefined
    ) => {
      if (comment.author) {
        await banUser({
          userID: comment.author.id,
          message,
          rejectExistingComments,
          siteIDs,
        });
      }
      setShowBanModal(false);
    },
    [comment, banUser, setShowBanModal]
  );

  // Only highlight comments that have been flagged for containing a banned or
  // suspect word.
  const highlight = useMemo(
    () =>
      comment.revision
        ? comment.revision.actionCounts.flag.reasons
            .COMMENT_DETECTED_BANNED_WORD +
            comment.revision.actionCounts.flag.reasons
              .COMMENT_DETECTED_SUSPECT_WORD >
          0
        : false,
    [comment]
  );

  return (
    <>
      <FadeInTransition active={!!comment.enteredLive}>
        <ModerateCard
          id={comment.id}
          username={
            comment.author && comment.author.username
              ? comment.author.username
              : ""
          }
          createdAt={comment.createdAt}
          body={comment.body!}
          highlight={highlight}
          inReplyTo={comment.parent && comment.parent.author}
          comment={comment}
          settings={settings}
          dangling={danglingLogic(comment.status)}
          status={getStatus(comment)}
          featured={isFeatured(comment)}
          viewContextHref={comment.permalink}
          phrases={settings}
          onApprove={handleApprove}
          onReject={handleReject}
          onFeature={onFeature}
          onUsernameClick={onUsernameClicked}
          onConversationClick={
            conversationClicked ? onConversationClicked : null
          }
          selected={selected}
          selectPrev={selectPrev}
          selectNext={selectNext}
          siteName={settings.multisite ? comment.site.name : null}
          onBan={openBanModal}
          moderatedBy={
            <ModeratedByContainer
              onUsernameClicked={onUsernameClicked}
              comment={comment}
            />
          }
          onFocusOrClick={onFocusOrClick}
          showStory={showStoryInfo}
          storyTitle={
            (comment.story.metadata && comment.story.metadata.title) || (
              <NotAvailable />
            )
          }
          storyHref={getModerationLink({ storyID: comment.story.id })}
          onModerateStory={handleModerateStory}
          mini={mini}
          hideUsername={hideUsername}
          deleted={comment.deleted ? comment.deleted : false}
          edited={comment.editing.edited}
          readOnly={readOnly}
          isQA={comment.story.settings.mode === GQLSTORY_MODE.QA}
        />
      </FadeInTransition>
      <BanModal
        username={
          comment.author && comment.author.username
            ? comment.author.username
            : ""
        }
        open={showBanModal}
        onClose={handleBanModalClose}
        onConfirm={handleBanConfirm}
        viewerScopes={{
          role: viewer.role,
          sites: viewer.moderationScopes?.sites?.map((s) => s),
        }}
        userScopes={{
          role: comment.author ? comment.author.role : GQLUSER_ROLE.COMMENTER,
          sites: comment.author
            ? comment.author.status.ban.sites?.map((s) => s)
            : [],
        }}
      />
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ModerateCardContainer_comment on Comment {
      id
      author {
        id
        username
        status {
          current
          ban {
            sites {
              id
              name
            }
          }
        }
        role
      }
      statusLiveUpdated
      createdAt
      body
      revision {
        actionCounts {
          flag {
            reasons {
              COMMENT_DETECTED_BANNED_WORD
              COMMENT_DETECTED_SUSPECT_WORD
            }
          }
        }
      }
      tags {
        code
      }
      status
      revision {
        id
      }
      editing {
        edited
      }
      parent {
        author {
          id
          username
        }
      }
      canModerate
      story {
        id
        metadata {
          title
        }
        settings {
          mode
        }
      }
      site {
        id
        name
      }
      permalink
      enteredLive
      deleted
      ...MarkersContainer_comment
      ...ModeratedByContainer_comment
      ...CommentAuthorContainer_comment
      ...MediaContainer_comment
    }
  `,
  settings: graphql`
    fragment ModerateCardContainer_settings on Settings {
      locale
      wordList {
        banned
        suspect
      }
      multisite
      featureFlags
      ...MarkersContainer_settings
    }
  `,
  viewer: graphql`
    fragment ModerateCardContainer_viewer on User {
      role
      moderationScopes {
        scoped
        sites {
          id
          name
        }
      }
    }
  `,
})(withRouter(ModerateCardContainer));

export default enhanced;
