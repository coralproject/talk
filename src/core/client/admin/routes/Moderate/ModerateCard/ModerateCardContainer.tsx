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

import UserHistoryDrawerContainer from "../UserHistoryDrawer/UserHistoryDrawerContainer";
import FadeInTransition from "./FadeInTransition";
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
}

interface State {
  showHistory: boolean;
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

class ModerateCardContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showHistory: false,
    };
  }

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

  private onShowCommentHistory = () => {
    this.setState({
      showHistory: true,
    });
  };
  private onHideCommentHistory = () => {
    this.setState({
      showHistory: false,
    });
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
    const { showHistory } = this.state;
    const dangling = danglingLogic(comment.status);
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
            dangling={dangling}
            status={getStatus(comment)}
            featured={isFeatured(comment)}
            viewContextHref={comment.permalink}
            suspectWords={settings.wordList.suspect}
            bannedWords={settings.wordList.banned}
            onApprove={this.handleApprove}
            onReject={this.handleReject}
            onFeature={this.onFeature}
            onUsernameClick={this.onShowCommentHistory}
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
            onModerateStory={this.handleModerateStory}
          />
        </FadeInTransition>
        <UserHistoryDrawerContainer
          open={showHistory}
          onClose={this.onHideCommentHistory}
          user={comment.author!}
        />
      </>
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ModerateCardContainer_comment on Comment {
      id
      author {
        id
        username
        ...UserHistoryDrawerContainer_user
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
