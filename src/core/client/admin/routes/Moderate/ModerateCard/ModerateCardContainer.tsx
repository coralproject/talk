import { Match, Router, withRouter } from "found";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import {
  COMMENT_STATUS,
  ModerateCardContainer_comment,
} from "coral-admin/__generated__/ModerateCardContainer_comment.graphql";
import { ModerateCardContainer_settings } from "coral-admin/__generated__/ModerateCardContainer_settings.graphql";
import { ModerateCardContainer_viewer } from "coral-admin/__generated__/ModerateCardContainer_viewer.graphql";
import NotAvailable from "coral-admin/components/NotAvailable";
import { getModerationLink } from "coral-admin/helpers";
import { ApproveCommentMutation } from "coral-admin/mutations";
import { RejectCommentMutation } from "coral-admin/mutations";
import FadeInTransition from "coral-framework/components/FadeInTransition";
import {
  MutationProp,
  withFragmentContainer,
  withMutation,
} from "coral-framework/lib/relay";
import { GQLTAG } from "coral-framework/schema";

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
  danglingLogic: (status: COMMENT_STATUS) => boolean;
  match: Match;
  router: Router;
  showStoryInfo: boolean;
  mini?: boolean;
  hideUsername?: boolean;
  onUsernameClicked?: (userID: string) => void;
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
  onUsernameClicked: usernameClicked,
}) => {
  const handleApprove = useCallback(() => {
    approveComment({
      commentID: comment.id,
      commentRevisionID: comment.revision.id,
      storyID: match.params.storyID,
    });
  }, [approveComment, comment, match]);

  const handleReject = useCallback(() => {
    rejectComment({
      commentID: comment.id,
      commentRevisionID: comment.revision.id,
      storyID: match.params.storyID,
    });
  }, [rejectComment, comment, match]);

  const handleFeature = useCallback(() => {
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

  const onUsernameClicked = useCallback(() => {
    if (!usernameClicked) {
      return;
    }
    usernameClicked(comment.author!.id);
  }, [usernameClicked, comment]);

  const handleModerateStory = useCallback(
    (e: React.MouseEvent) => {
      router.push(getModerationLink("default", comment.story.id));
      if (e.preventDefault) {
        e.preventDefault();
      }
    },
    [router, comment]
  );

  return (
    <>
      <FadeInTransition active={Boolean(comment.enteredLive)}>
        <ModerateCard
          id={comment.id}
          username={comment.author!.username!}
          createdAt={comment.createdAt}
          body={comment.body!}
          inReplyTo={comment.parent && comment.parent.author!.username!}
          comment={comment}
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
          moderatedBy={
            <ModeratedByContainer viewer={viewer} comment={comment} />
          }
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
        />
      </FadeInTransition>
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
      parent {
        author {
          username
        }
      }
      story {
        id
        metadata {
          title
        }
      }
      permalink
      enteredLive
      ...MarkersContainer_comment
      ...ModeratedByContainer_comment
    }
  `,
  settings: graphql`
    fragment ModerateCardContainer_settings on Settings {
      wordList {
        banned
        suspect
      }
    }
  `,
  viewer: graphql`
    fragment ModerateCardContainer_viewer on User {
      ...ModeratedByContainer_viewer
    }
  `,
})(
  withRouter(
    withMutation(ApproveCommentMutation)(
      withMutation(RejectCommentMutation)(
        withMutation(FeatureCommentMutation)(
          withMutation(UnfeatureCommentMutation)(ModerateCardContainer)
        )
      )
    )
  )
);

export default enhanced;
