import { Child as PymChild } from "pym.js";
import React, { MouseEvent } from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "talk-framework/helpers";
import { withContext } from "talk-framework/lib/bootstrap";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { PermalinkViewContainer_comment as CommentData } from "talk-stream/__generated__/PermalinkViewContainer_comment.graphql";
import { PermalinkViewContainer_me as MeData } from "talk-stream/__generated__/PermalinkViewContainer_me.graphql";
import { PermalinkViewContainer_settings as SettingsData } from "talk-stream/__generated__/PermalinkViewContainer_settings.graphql";
import { PermalinkViewContainer_story as StoryData } from "talk-stream/__generated__/PermalinkViewContainer_story.graphql";
import {
  SetCommentIDMutation,
  withSetCommentIDMutation,
} from "talk-stream/mutations";

import PermalinkView from "../components/PermalinkView";

interface PermalinkViewContainerProps {
  comment: CommentData | null;
  story: StoryData;
  settings: SettingsData;
  me: MeData | null;
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
    const { comment, story, me, settings } = this.props;
    return (
      <PermalinkView
        me={me}
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
        }
      `,
      comment: graphql`
        fragment PermalinkViewContainer_comment on Comment {
          id
          ...ConversationThreadContainer_comment
          ...ReplyListContainer1_comment
        }
      `,
      me: graphql`
        fragment PermalinkViewContainer_me on User {
          ...ConversationThreadContainer_me
          ...ReplyListContainer1_me
          ...UserBoxContainer_me
        }
      `,
      settings: graphql`
        fragment PermalinkViewContainer_settings on Settings {
          ...ConversationThreadContainer_settings
          ...ReplyListContainer1_settings
        }
      `,
    })(PermalinkViewContainer)
  )
);

export default enhanced;
