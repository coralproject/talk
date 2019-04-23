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

interface ModerateCardContainerProps {
  comment: CommentData;
  settings: SettingsData;
  acceptComment: MutationProp<typeof AcceptCommentMutation>;
  rejectComment: MutationProp<typeof RejectCommentMutation>;
  danglingLogic: (status: COMMENT_STATUS) => boolean;
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

class ModerateCardContainer extends React.Component<
  ModerateCardContainerProps
> {
  private handleAccept = () => {
    this.props.acceptComment({
      commentID: this.props.comment.id,
      commentRevisionID: this.props.comment.revision.id,
    });
  };

  private handleReject = () => {
    this.props.rejectComment({
      commentID: this.props.comment.id,
      commentRevisionID: this.props.comment.revision.id,
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

const enhanced = withFragmentContainer<ModerateCardContainerProps>({
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
  withMutation(AcceptCommentMutation)(
    withMutation(RejectCommentMutation)(ModerateCardContainer)
  )
);

export default enhanced;
