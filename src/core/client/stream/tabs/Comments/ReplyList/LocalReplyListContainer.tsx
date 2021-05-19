import React, { Component } from "react";
import { graphql } from "react-relay";

import withFragmentContainer from "coral-framework/lib/relay/withFragmentContainer";
import { PropTypesOf } from "coral-framework/types";

import { LocalReplyListContainer_comment } from "coral-stream/__generated__/LocalReplyListContainer_comment.graphql";
import { LocalReplyListContainer_settings } from "coral-stream/__generated__/LocalReplyListContainer_settings.graphql";
import { LocalReplyListContainer_story } from "coral-stream/__generated__/LocalReplyListContainer_story.graphql";
import { LocalReplyListContainer_viewer } from "coral-stream/__generated__/LocalReplyListContainer_viewer.graphql";

import ReplyList from "./ReplyList";

interface Props {
  indentLevel?: number;
  viewer: LocalReplyListContainer_viewer | null;
  story: LocalReplyListContainer_story;
  comment: LocalReplyListContainer_comment;
  settings: LocalReplyListContainer_settings;
  allowIgnoredTombstoneReveal?: boolean;
}

/**
 * LocalReplyListContainer renders the replies from the endpoint
 * `localReplies` instead of `replies`. This is e.g. used for the
 * ultimate threading level to only display the newly created comments
 * from the current user.
 */
export class LocalReplyListContainer extends Component<Props> {
  public render() {
    if (!this.props.comment.localReplies) {
      return null;
    }
    return (
      <ReplyList
        viewer={this.props.viewer}
        settings={this.props.settings}
        comment={this.props.comment}
        comments={this.props.comment.localReplies}
        story={this.props.story}
        indentLevel={this.props.indentLevel}
        disableReplies
        allowIgnoredTombstoneReveal={this.props.allowIgnoredTombstoneReveal}
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment LocalReplyListContainer_viewer on User {
      ...ReplyListCommentContainer_viewer
    }
  `,
  story: graphql`
    fragment LocalReplyListContainer_story on Story {
      ...ReplyListCommentContainer_story
    }
  `,
  comment: graphql`
    fragment LocalReplyListContainer_comment on Comment {
      id
      localReplies {
        id
        ...ReplyListCommentContainer_comment
      }
    }
  `,
  settings: graphql`
    fragment LocalReplyListContainer_settings on Settings {
      ...ReplyListCommentContainer_settings
    }
  `,
})(LocalReplyListContainer);

export type LocalReplyListContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
