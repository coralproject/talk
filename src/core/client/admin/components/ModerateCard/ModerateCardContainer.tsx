import { Match, Router, withRouter } from "found";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import NotAvailable from "coral-admin/components/NotAvailable";
import BanModal from "coral-admin/components/UserStatus/BanModal";
import { getModerationLink } from "coral-admin/helpers";
import {
  ApproveCommentMutation,
  RejectCommentMutation,
} from "coral-admin/mutations";
import FadeInTransition from "coral-framework/components/FadeInTransition";
import {
  MutationProp,
  withFragmentContainer,
  withMutation,
} from "coral-framework/lib/relay";
import { GQLTAG, GQLUSER_STATUS } from "coral-framework/schema";

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
  comment: ModerateCardContainer_comment;
  viewer: ModerateCardContainer_viewer;
  settings: ModerateCardContainer_settings;
  approveComment: MutationProp<typeof ApproveCommentMutation>;
  rejectComment: MutationProp<typeof RejectCommentMutation>;
  featureComment: MutationProp<typeof FeatureCommentMutation>;
  unfeatureComment: MutationProp<typeof UnfeatureCommentMutation>;
  banUser: MutationProp<typeof BanCommentUserMutation>;
  danglingLogic: (status: COMMENT_STATUS) => boolean;
  match: Match;
  router: Router;
  showStoryInfo: boolean;
  mini?: boolean;
  hideUsername?: boolean;
  onUsernameClicked?: (userID: string) => void;
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
  return comment.tags.some(t => t.code === GQLTAG.FEATURED);
}

const ModerateCardContainer: FunctionComponent<Props> = ({
  comment,
  settings,
  danglingLogic,
  showStoryInfo,
  viewer,
  match,
  router,
  approveComment,
  rejectComment,
  featureComment,
  unfeatureComment,
  mini,
  hideUsername,
  selected,
  selectPrev,
  selectNext,
  onUsernameClicked: usernameClicked,
  onSetSelected: setSelected,
  banUser,
  loadNext,
}) => {
  const [showBanModal, setShowBanModal] = useState(false);
  const handleApprove = useCallback(async () => {
    if (!comment.revision) {
      return;
    }

    await approveComment({
      commentID: comment.id,
      commentRevisionID: comment.revision.id,
      storyID: match.params.storyID,
    });
    if (loadNext) {
      loadNext();
    }
  }, [approveComment, comment, match]);

  const handleReject = useCallback(async () => {
    if (!comment.revision) {
      return;
    }

    await rejectComment({
      commentID: comment.id,
      commentRevisionID: comment.revision.id,
      storyID: match.params.storyID,
    });
    if (loadNext) {
      loadNext();
    }
  }, [rejectComment, comment, match]);

  const handleFeature = useCallback(() => {
    if (!comment.revision) {
      return;
    }

    featureComment({
      commentID: comment.id,
      commentRevisionID: comment.revision.id,
      storyID: match.params.storyID,
    });
  }, [featureComment, comment, match]);

  const handleUnfeature = useCallback(() => {
    unfeatureComment({
      commentID: comment.id,
      storyID: match.params.storyID,
    });
  }, [unfeatureComment, comment, match]);

  const onFeature = useCallback(() => {
    const featured = isFeatured(comment);

    if (featured) {
      handleUnfeature();
    } else {
      handleFeature();
    }
  }, [comment]);

  const onUsernameClicked = useCallback(
    (id?: string) => {
      if (!usernameClicked) {
        return;
      }
      usernameClicked(id || comment.author!.id);
    },
    [usernameClicked, comment]
  );

  const handleModerateStory = useCallback(
    (e: React.MouseEvent) => {
      router.push(getModerationLink("default", comment.story.id));
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
  }, [selected, comment]);

  const handleBanModalClose = useCallback(() => {
    setShowBanModal(false);
  }, []);

  const openBanModal = useCallback(() => {
    if (
      !comment.author ||
      comment.author.status.current.includes(GQLUSER_STATUS.BANNED)
    ) {
      return;
    }
    setShowBanModal(true);
  }, [comment]);

  const handleBanConfirm = useCallback(
    async (message: string) => {
      if (comment.author) {
        await banUser({ userID: comment.author.id, message });
      }
      setShowBanModal(false);
    },
    [comment]
  );
  return (
    <>
      <FadeInTransition active={Boolean(comment.enteredLive)}>
        <ModerateCard
          id={comment.id}
          username={
            comment.author && comment.author.username
              ? comment.author.username
              : ""
          }
          createdAt={comment.createdAt}
          body={comment.body!}
          inReplyTo={comment.parent && comment.parent.author}
          comment={comment}
          settings={settings}
          dangling={danglingLogic(comment.status)}
          status={getStatus(comment)}
          featured={isFeatured(comment)}
          viewContextHref={comment.permalink}
          suspectWords={settings.wordList.suspect}
          bannedWords={settings.wordList.banned}
          onApprove={handleApprove}
          onReject={handleReject}
          onFeature={onFeature}
          onUsernameClick={onUsernameClicked}
          selected={selected}
          selectPrev={selectPrev}
          selectNext={selectNext}
          siteName={settings.multisite ? comment.site.name : null}
          onBan={openBanModal}
          moderatedBy={
            <ModeratedByContainer
              onUsernameClicked={onUsernameClicked}
              viewer={viewer}
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
          storyHref={getModerationLink("default", comment.story.id)}
          onModerateStory={handleModerateStory}
          mini={mini}
          hideUsername={hideUsername}
          deleted={comment.deleted ? comment.deleted : false}
          edited={comment.editing.edited}
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
        }
      }
      statusLiveUpdated
      createdAt
      body
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
      story {
        id
        metadata {
          title
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
    }
  `,
  settings: graphql`
    fragment ModerateCardContainer_settings on Settings {
      wordList {
        banned
        suspect
      }
      multisite
      ...MarkersContainer_settings
    }
  `,
  viewer: graphql`
    fragment ModerateCardContainer_viewer on User {
      ...ModeratedByContainer_viewer
    }
  `,
})(
  withRouter(
    withMutation(BanCommentUserMutation)(
      withMutation(ApproveCommentMutation)(
        withMutation(RejectCommentMutation)(
          withMutation(FeatureCommentMutation)(
            withMutation(UnfeatureCommentMutation)(ModerateCardContainer)
          )
        )
      )
    )
  )
);

export default enhanced;
