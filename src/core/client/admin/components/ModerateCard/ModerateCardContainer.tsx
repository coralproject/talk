import { useRouter } from "found";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { graphql, useFragment } from "react-relay";

import NotAvailable from "coral-admin/components/NotAvailable";
import BanModal, {
  UpdateType,
} from "coral-admin/components/UserStatus/BanModal";
import {
  ApproveCommentMutation,
  RejectCommentMutation,
} from "coral-admin/mutations";
import FadeInTransition from "coral-framework/components/FadeInTransition";
import { getModerationLink } from "coral-framework/helpers";
import parseModerationOptions from "coral-framework/helpers/parseModerationOptions";
import { useLocal, useMutation } from "coral-framework/lib/relay";
import { GQLSTORY_MODE, GQLTAG, GQLUSER_STATUS } from "coral-framework/schema";

import {
  COMMENT_STATUS,
  ModerateCardContainer_comment as CommentModel,
  ModerateCardContainer_comment$key as ModerateCardContainer_comment,
} from "coral-admin/__generated__/ModerateCardContainer_comment.graphql";
import { ModerateCardContainer_settings$key as ModerateCardContainer_settings } from "coral-admin/__generated__/ModerateCardContainer_settings.graphql";
import { ModerateCardContainer_viewer$key as ModerateCardContainer_viewer } from "coral-admin/__generated__/ModerateCardContainer_viewer.graphql";
import { ModerateCardContainerLocal } from "coral-admin/__generated__/ModerateCardContainerLocal.graphql";

import RemoveUserBanMutation from "../UserStatus/RemoveUserBanMutation";
import UpdateUserBanMutation from "../UserStatus/UpdateUserBanMutation";
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

function getStatus(comment: CommentModel) {
  switch (comment.status) {
    case "APPROVED":
      return "approved";
    case "REJECTED":
      return "rejected";
    default:
      return "undecided";
  }
}

function isFeatured(comment: CommentModel) {
  return comment.tags.some((t) => t.code === GQLTAG.FEATURED);
}

const ModerateCardContainer: FunctionComponent<Props> = ({
  comment,
  settings,
  viewer,
  danglingLogic,
  showStoryInfo,
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
  const commentData = useFragment(
    graphql`
      fragment ModerateCardContainer_comment on Comment {
        id
        author {
          id
          username
          status {
            current
            ban {
              active
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
        rating
        revision {
          actionCounts {
            flag {
              reasons {
                COMMENT_DETECTED_BANNED_WORD
                COMMENT_DETECTED_SUSPECT_WORD
              }
            }
          }
          metadata {
            wordList {
              bannedWords {
                value
                index
                length
              }
              suspectWords {
                value
                index
                length
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
          isArchived
          isArchiving
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
    comment
  );
  const settingsData = useFragment(
    graphql`
      fragment ModerateCardContainer_settings on Settings {
        locale
        wordList {
          banned
          suspect
        }
        multisite
        ...MarkersContainer_settings
      }
    `,
    settings
  );
  const viewerData = useFragment(
    graphql`
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
    viewer
  );

  const approveComment = useMutation(ApproveCommentMutation);
  const rejectComment = useMutation(RejectCommentMutation);
  const featureComment = useMutation(FeatureCommentMutation);
  const unfeatureComment = useMutation(UnfeatureCommentMutation);
  const banUser = useMutation(BanCommentUserMutation);
  const updateUserBan = useMutation(UpdateUserBanMutation);
  const removeUserBan = useMutation(RemoveUserBanMutation);

  const { match, router } = useRouter();

  const [{ moderationQueueSort }] = useLocal<
    ModerateCardContainerLocal
  >(graphql`
    fragment ModerateCardContainerLocal on Local {
      moderationQueueSort
    }
  `);

  const scoped = useMemo(() => !!viewerData.moderationScopes?.scoped, [
    viewerData,
  ]);

  const readOnly = useMemo(() => scoped && !commentData.canModerate, [
    scoped,
    commentData,
  ]);

  const [showBanModal, setShowBanModal] = useState(false);
  const handleApprove = useCallback(async () => {
    if (!commentData.revision) {
      return;
    }

    if (readOnly) {
      return;
    }

    const { storyID, siteID, section } = parseModerationOptions(match);

    await approveComment({
      commentID: commentData.id,
      commentRevisionID: commentData.revision.id,
      storyID,
      siteID,
      section,
      orderBy: moderationQueueSort,
    });
    if (loadNext) {
      loadNext();
    }
  }, [
    approveComment,
    commentData.id,
    commentData.revision,
    loadNext,
    match,
    readOnly,
    moderationQueueSort,
  ]);

  const handleReject = useCallback(async () => {
    if (!commentData.revision) {
      return;
    }

    if (readOnly) {
      return;
    }

    const { storyID, siteID, section } = parseModerationOptions(match);

    await rejectComment({
      commentID: commentData.id,
      commentRevisionID: commentData.revision.id,
      storyID,
      siteID,
      section,
      orderBy: moderationQueueSort,
    });
    if (loadNext) {
      loadNext();
    }
  }, [
    commentData.revision,
    commentData.id,
    readOnly,
    match,
    rejectComment,
    loadNext,
    moderationQueueSort,
  ]);

  const handleFeature = useCallback(() => {
    if (!commentData.revision) {
      return;
    }

    if (readOnly) {
      return;
    }

    const { storyID, siteID, section } = parseModerationOptions(match);

    void featureComment({
      commentID: commentData.id,
      commentRevisionID: commentData.revision.id,
      storyID,
      siteID,
      section,
      orderBy: moderationQueueSort,
    });
  }, [featureComment, commentData, match, readOnly, moderationQueueSort]);

  const handleUnfeature = useCallback(() => {
    if (readOnly) {
      return;
    }

    void unfeatureComment({
      commentID: commentData.id,
      storyID: match.params.storyID,
    });
  }, [unfeatureComment, commentData, match, readOnly]);

  const onFeature = useCallback(() => {
    if (readOnly) {
      return;
    }

    const featured = isFeatured(commentData);
    if (featured) {
      handleUnfeature();
    } else {
      handleFeature();
    }
  }, [commentData, readOnly, handleFeature, handleUnfeature]);

  const onUsernameClicked = useCallback(
    (id?: string) => {
      if (!usernameClicked) {
        return;
      }
      usernameClicked(id || commentData.author!.id);
    },
    [usernameClicked, commentData]
  );

  const onConversationClicked = useCallback(() => {
    if (!conversationClicked) {
      return;
    }
    conversationClicked(commentData.id);
  }, [conversationClicked, commentData]);

  const handleModerateStory = useCallback(
    (e: React.MouseEvent) => {
      router.push(getModerationLink({ storyID: commentData.story.id }));
      if (e.preventDefault) {
        e.preventDefault();
      }
    },
    [router, commentData]
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
      !commentData.author ||
      commentData.author.status.current.includes(GQLUSER_STATUS.BANNED)
    ) {
      return;
    }

    setShowBanModal(true);
  }, [commentData, setShowBanModal]);

  const handleBanConfirm = useCallback(
    async (
      updateType: UpdateType,
      rejectExistingComments: boolean,
      banSiteIDs: string[] | null | undefined,
      unbanSiteIDs: string[] | null | undefined,
      message: string
    ) => {
      const viewerIsScoped = !!viewerData.moderationScopes?.sites?.length;
      switch (updateType) {
        case UpdateType.ALL_SITES:
          await banUser({
            userID: commentData.author!.id, // Should be defined because the modal shouldn't open if author is null
            message,
            rejectExistingComments,
            siteIDs: viewerIsScoped
              ? viewerData.moderationScopes!.sites!.map(({ id }) => id)
              : [],
          });
          break;
        case UpdateType.SPECIFIC_SITES:
          await updateUserBan({
            userID: commentData.author!.id,
            message,
            banSiteIDs,
            unbanSiteIDs,
          });
          break;
        case UpdateType.NO_SITES:
          await removeUserBan({
            userID: commentData.author!.id,
          });
      }
      setShowBanModal(false);
    },
    [
      commentData,
      banUser,
      setShowBanModal,
      removeUserBan,
      updateUserBan,
      viewerData,
    ]
  );

  // Only highlight comments that have been flagged for containing a banned or
  // suspect word.
  const highlight = useMemo(() => {
    if (!commentData.revision) {
      return false;
    }

    if (!commentData.revision.actionCounts) {
      throw new Error(`action counts missing: ${commentData.id}`);
    }

    const count =
      commentData.revision.actionCounts.flag.reasons
        .COMMENT_DETECTED_BANNED_WORD +
      commentData.revision.actionCounts.flag.reasons
        .COMMENT_DETECTED_SUSPECT_WORD;

    return count > 0;
  }, [commentData]);

  const isRatingsAndReviews =
    commentData.story.settings.mode === GQLSTORY_MODE.RATINGS_AND_REVIEWS;

  return (
    <>
      <FadeInTransition active={!!commentData.enteredLive}>
        <ModerateCard
          id={commentData.id}
          username={
            commentData.author && commentData.author.username
              ? commentData.author.username
              : ""
          }
          createdAt={commentData.createdAt}
          body={commentData.body!}
          rating={isRatingsAndReviews ? commentData.rating : null}
          highlight={highlight}
          inReplyTo={commentData.parent && commentData.parent.author}
          comment={commentData}
          settings={settingsData}
          dangling={danglingLogic(commentData.status)}
          status={getStatus(commentData)}
          featured={isFeatured(commentData)}
          viewContextHref={commentData.permalink}
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
          siteName={settingsData.multisite ? commentData.site.name : null}
          onBan={openBanModal}
          moderatedBy={
            <ModeratedByContainer
              onUsernameClicked={onUsernameClicked}
              comment={commentData}
            />
          }
          onFocusOrClick={onFocusOrClick}
          showStory={showStoryInfo}
          storyTitle={
            (commentData.story.metadata &&
              commentData.story.metadata.title) || <NotAvailable />
          }
          storyHref={getModerationLink({ storyID: commentData.story.id })}
          onModerateStory={handleModerateStory}
          mini={mini}
          hideUsername={hideUsername}
          deleted={commentData.deleted ? commentData.deleted : false}
          edited={commentData.editing.edited}
          readOnly={readOnly}
          isQA={commentData.story.settings.mode === GQLSTORY_MODE.QA}
          bannedWords={
            commentData.revision?.metadata?.wordList?.bannedWords || []
          }
          suspectWords={
            commentData.revision?.metadata?.wordList?.suspectWords || []
          }
          isArchived={commentData.story.isArchived}
          isArchiving={commentData.story.isArchiving}
        />
      </FadeInTransition>
      {commentData.author && (
        <BanModal
          username={
            commentData.author && commentData.author.username
              ? commentData.author.username
              : ""
          }
          open={showBanModal}
          onClose={handleBanModalClose}
          onConfirm={handleBanConfirm}
          viewerScopes={{
            role: viewerData.role,
            sites: viewerData.moderationScopes?.sites?.map((s) => s),
          }}
          moderationScopesEnabled={settingsData.multisite}
          userBanStatus={commentData.author.status.ban}
        />
      )}
    </>
  );
};

export default ModerateCardContainer;
