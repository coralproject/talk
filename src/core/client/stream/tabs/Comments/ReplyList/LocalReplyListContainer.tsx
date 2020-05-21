import React, { Component } from "react";
import { graphql } from "react-relay";

import withFragmentContainer from "coral-framework/lib/relay/withFragmentContainer";
import { PropTypesOf } from "coral-framework/types";

import { LocalReplyListContainer_comment as CommentData } from "coral-stream/__generated__/LocalReplyListContainer_comment.graphql";
import { LocalReplyListContainer_settings as SettingsData } from "coral-stream/__generated__/LocalReplyListContainer_settings.graphql";
import { LocalReplyListContainer_story as StoryData } from "coral-stream/__generated__/LocalReplyListContainer_story.graphql";
import { LocalReplyListContainer_viewer as ViewerData } from "coral-stream/__generated__/LocalReplyListContainer_viewer.graphql";

import ReplyList from "./ReplyList";

interface Props {
  indentLevel: number;
  viewer: ViewerData;
  story: StoryData;
  comment: CommentData;
  settings: SettingsData;
  singleConversationView?: boolean;
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
        singleConversationView={this.props.singleConversationView}
      />
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment LocalReplyListContainer_viewer on User {
      ...CommentContainer_viewer
      ...IgnoredTombstoneOrHideContainer_viewer
    }
  `,
  story: graphql`
    fragment LocalReplyListContainer_story on Story {
      ...CommentContainer_story
    }
  `,
  comment: graphql`
    fragment LocalReplyListContainer_comment on Comment {
      id
      localReplies {
        id
        ...CommentContainer_comment
        ...IgnoredTombstoneOrHideContainer_comment
      }
    }
  `,
  settings: graphql`
    fragment LocalReplyListContainer_settings on Settings {
      ...CommentContainer_settings
    }
  `,
})(LocalReplyListContainer);

export type LocalReplyListContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
