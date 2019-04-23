import { Child as PymChild } from "pym.js";
import React, { MouseEvent } from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "talk-framework/helpers";
import { withContext } from "talk-framework/lib/bootstrap";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { PermalinkViewContainer_comment as CommentData } from "talk-stream/__generated__/PermalinkViewContainer_comment.graphql";
import { PermalinkViewContainer_settings as SettingsData } from "talk-stream/__generated__/PermalinkViewContainer_settings.graphql";
import { PermalinkViewContainer_story as StoryData } from "talk-stream/__generated__/PermalinkViewContainer_story.graphql";
import { PermalinkViewContainer_viewer as ViewerData } from "talk-stream/__generated__/PermalinkViewContainer_viewer.graphql";
import {
  SetCommentIDMutation,
  withSetCommentIDMutation,
} from "talk-stream/mutations";

import PermalinkView from "../components/PermalinkView";

interface PermalinkViewContainerProps {
  comment: CommentData | null;
  story: StoryData;
  settings: SettingsData;
  viewer: ViewerData | null;
  setCommentID: SetCommentIDMutation;
  pym: PymChild | undefined;
}

class PermalinkViewContainer extends React.Component<
  PermalinkViewContainerProps
> {
  private showAllComments = (e: MouseEvent<any>) => {
    this.props.setCommentID({ id: null });
    e.preventDefault();
  };
  private getShowAllCommentsHref() {
    const { pym } = this.props;
    const url = (pym && pym.parentUrl) || window.location.href;
    return getURLWithCommentID(url, undefined);
  }

  public componentDidMount() {
    if (this.props.pym) {
      setTimeout(() => this.props.pym!.scrollParentToChildPos(0), 100);
    }
  }

  public render() {
    const { comment, story, viewer, settings } = this.props;
    return (
      <PermalinkView
        viewer={viewer}
        story={story}
        comment={comment}
        settings={settings}
        showAllCommentsHref={this.getShowAllCommentsHref()}
        onShowAllComments={this.showAllComments}
      />
    );
  }
}

const enhanced = withContext(ctx => ({
  pym: ctx.pym,
}))(
  withSetCommentIDMutation(
    withFragmentContainer<PermalinkViewContainerProps>({
      story: graphql`
        fragment PermalinkViewContainer_story on Story {
          ...ConversationThreadContainer_story
          ...ReplyListContainer1_story
          ...CreateCommentMutation_story
          ...CreateCommentReplyMutation_story
        }
      `,
      comment: graphql`
        fragment PermalinkViewContainer_comment on Comment {
          id
          ...ConversationThreadContainer_comment
          ...ReplyListContainer1_comment
        }
      `,
      viewer: graphql`
        fragment PermalinkViewContainer_viewer on User {
          ...ConversationThreadContainer_viewer
          ...ReplyListContainer1_viewer
          ...UserBoxContainer_viewer
          ...CreateCommentMutation_viewer
          ...CreateCommentReplyMutation_viewer
        }
      `,
      settings: graphql`
        fragment PermalinkViewContainer_settings on Settings {
          ...ConversationThreadContainer_settings
          ...ReplyListContainer1_settings
          ...UserBoxContainer_settings
        }
      `,
    })(PermalinkViewContainer)
  )
);

export default enhanced;
