import { Match, Router, withRouter } from "found";
import React from "react";
import { graphql } from "react-relay";

import {
  COMMENT_STATUS,
  ModerateCardContainer_comment as CommentData,
} from "coral-admin/__generated__/ModerateCardContainer_comment.graphql";
import { ModerateCardContainer_settings as SettingsData } from "coral-admin/__generated__/ModerateCardContainer_settings.graphql";
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

import ModerateCard from "./ModerateCard";

interface Props {
  comment: CommentData;
  settings: SettingsData;
  approveComment: MutationProp<typeof ApproveCommentMutation>;
  rejectComment: MutationProp<typeof RejectCommentMutation>;
  danglingLogic: (status: COMMENT_STATUS) => boolean;
  match: Match;
  router: Router;
  showStoryInfo: boolean;
}

function getStatus(comment: CommentData) {
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

  private handleModerateStory = (e: React.MouseEvent) => {
    this.props.router.push(
      getModerationLink("default", this.props.comment.story.id)
    );
    if (e.preventDefault) {
      e.preventDefault();
    }
  };

  public render() {
    const { comment, settings, danglingLogic, showStoryInfo } = this.props;
    return (
      <ModerateCard
        id={comment.id}
        username={comment.author!.username!}
        createdAt={comment.createdAt}
        body={comment.body!}
        inReplyTo={comment.parent && comment.parent.author!.username!}
        comment={comment}
        status={getStatus(comment)}
        featured={isFeatured(comment)}
        viewContextHref={comment.permalink}
        suspectWords={settings.wordList.suspect}
        bannedWords={settings.wordList.banned}
        onApprove={this.handleApprove}
        onReject={this.handleReject}
        dangling={danglingLogic(comment.status)}
        showStory={showStoryInfo}
        storyTitle={
          (comment.story.metadata && comment.story.metadata.title) || (
            <NotAvailable />
          )
        }
        storyHref={getModerationLink("default", comment.story.id)}
        onModerateStory={this.handleModerateStory}
      />
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
      createdAt
      body
      status
      tags {
        code
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
})(
  withRouter(
    withMutation(ApproveCommentMutation)(
      withMutation(RejectCommentMutation)(ModerateCardContainer)
    )
  )
);

export default enhanced;
