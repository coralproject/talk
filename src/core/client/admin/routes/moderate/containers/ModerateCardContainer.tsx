import { Match, Router, withRouter } from "found";
import React from "react";
import { graphql } from "react-relay";

import {
  COMMENT_STATUS,
  ModerateCardContainer_comment as CommentData,
} from "talk-admin/__generated__/ModerateCardContainer_comment.graphql";
import { ModerateCardContainer_settings as SettingsData } from "talk-admin/__generated__/ModerateCardContainer_settings.graphql";
import { AcceptCommentMutation } from "talk-admin/mutations";
import { RejectCommentMutation } from "talk-admin/mutations";
import {
  MutationProp,
  withFragmentContainer,
  withMutation,
} from "talk-framework/lib/relay";

import ModerateCard from "../components/ModerateCard";

interface Props {
  comment: CommentData;
  settings: SettingsData;
  acceptComment: MutationProp<typeof AcceptCommentMutation>;
  rejectComment: MutationProp<typeof RejectCommentMutation>;
  danglingLogic: (status: COMMENT_STATUS) => boolean;
  match: Match;
  router: Router;
}

function getStatus(comment: CommentData) {
  switch (comment.status) {
    case "ACCEPTED":
      return "accepted";
    case "REJECTED":
      return "rejected";
    default:
      return "undecided";
  }
}

class ModerateCardContainer extends React.Component<Props> {
  private handleAccept = () => {
    this.props.acceptComment({
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

  public render() {
    const { comment, settings, danglingLogic } = this.props;
    return (
      <ModerateCard
        id={comment.id}
        username={comment.author!.username!}
        createdAt={comment.createdAt}
        body={comment.body!}
        inReplyTo={comment.parent && comment.parent.author!.username!}
        comment={comment}
        status={getStatus(comment)}
        viewContextHref={comment.permalink}
        suspectWords={settings.wordList.suspect}
        bannedWords={settings.wordList.banned}
        onAccept={this.handleAccept}
        onReject={this.handleReject}
        dangling={danglingLogic(comment.status)}
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
      revision {
        id
      }
      parent {
        author {
          username
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
    withMutation(AcceptCommentMutation)(
      withMutation(RejectCommentMutation)(ModerateCardContainer)
    )
  )
);

export default enhanced;
