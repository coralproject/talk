import { Match, Router, withRouter } from "found";
import React from "react";
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
import {
  MutationProp,
  withFragmentContainer,
  withMutation,
} from "coral-framework/lib/relay";
import { GQLTAG } from "coral-framework/schema";

import FadeInTransition from "./FadeInTransition";
import FeatureCommentMutation from "./FeatureCommentMutation";
import ModerateCard from "./ModerateCard";
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

function isFeatured(comment: CommentData) {
  return comment.tags.some(t => t.code === GQLTAG.FEATURED);
}

class ModerateCardContainer extends React.Component<Props> {
  private handleApprove = () => {
    this.props.approveComment({
      commentID: this.props.comment.id,
      commentRevisionID: this.props.comment.revision.id,
      storyID: this.props.match.params.storyID,
    });
  };

  private handleReject = () => {
    this.props.rejectComment({
      commentID: this.props.comment.id,
      commentRevisionID: this.props.comment.revision.id,
      storyID: this.props.match.params.storyID,
    });
  };

  private onFeature = () => {
    const featured = isFeatured(this.props.comment);

    if (featured) {
      this.handleUnfeature();
    } else {
      this.handleFeature();
    }
  };

  private handleFeature = () => {
    this.props.featureComment({
      commentID: this.props.comment.id,
      commentRevisionID: this.props.comment.revision.id,
      storyID: this.props.match.params.storyID,
    });
  };

  private handleUnfeature = () => {
    this.props.unfeatureComment({
      commentID: this.props.comment.id,
      storyID: this.props.match.params.storyID,
    });
  };

  private handleModerateStory = (e: React.MouseEvent) => {
    this.props.router.push(
      getModerationLink("default", this.props.comment.story.id)
    );
    if (e.preventDefault) {
      e.preventDefault();
    }
  };

  public render() {
    const {
      comment,
      settings,
      danglingLogic,
      showStoryInfo,
      viewer,
    } = this.props;
    const dangling = danglingLogic(comment.status);
    // Show moderated by when comment was live moderated by another user.
    const moderatedBy =
      (comment.statusLiveUpdated &&
        comment.statusHistory.edges.length > 0 &&
        comment.statusHistory.edges[0].node.moderator &&
        viewer.id !== comment.statusHistory.edges[0].node.moderator.id &&
        comment.statusHistory.edges[0].node.moderator.username) ||
      null;
    return (
      <FadeInTransition active={Boolean(comment.enteredLive)}>
        <ModerateCard
          id={comment.id}
          username={comment.author!.username!}
          createdAt={comment.createdAt}
          body={comment.body!}
          inReplyTo={comment.parent && comment.parent.author!.username!}
          comment={comment}
          dangling={dangling}
          status={getStatus(comment)}
          featured={isFeatured(comment)}
          viewContextHref={comment.permalink}
          suspectWords={settings.wordList.suspect}
          bannedWords={settings.wordList.banned}
          onApprove={this.handleApprove}
          onReject={this.handleReject}
          onFeature={this.onFeature}
          moderatedBy={moderatedBy}
          showStory={showStoryInfo}
          storyTitle={
            (comment.story.metadata && comment.story.metadata.title) || (
              <NotAvailable />
            )
          }
          storyHref={getModerationLink("default", comment.story.id)}
          onModerateStory={this.handleModerateStory}
        />
      </FadeInTransition>
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ModerateCardContainer_comment on Comment {
      id
      author {
        username
      }
      statusLiveUpdated
      createdAt
      body
      tags {
        code
      }
      status
      statusHistory(first: 1) {
        edges {
          node {
            moderator {
              id
              username
            }
          }
        }
      }
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
      id
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
