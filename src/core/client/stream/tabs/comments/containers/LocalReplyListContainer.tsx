import React, { Component } from "react";
import { graphql } from "react-relay";

import withFragmentContainer from "talk-framework/lib/relay/withFragmentContainer";
import { PropTypesOf } from "talk-framework/types";
import { LocalReplyListContainer_asset as AssetData } from "talk-stream/__generated__/LocalReplyListContainer_asset.graphql";
import { LocalReplyListContainer_comment as CommentData } from "talk-stream/__generated__/LocalReplyListContainer_comment.graphql";
import { LocalReplyListContainer_me as MeData } from "talk-stream/__generated__/LocalReplyListContainer_me.graphql";
import { LocalReplyListContainer_settings as SettingsData } from "talk-stream/__generated__/LocalReplyListContainer_settings.graphql";

import ReplyList from "../components/ReplyList";

interface InnerProps {
  indentLevel: number;
  me: MeData;
  asset: AssetData;
  comment: CommentData;
  settings: SettingsData;
}

/**
 * LocalReplyListContainer renders the replies from the endpoint
 * `localReplies` instead of `replies`. This is e.g. used for the
 * ultimate threading level to only display the newly created comments
 * from the current user.
 */
export class LocalReplyListContainer extends Component<InnerProps> {
  public render() {
    if (!this.props.comment.localReplies) {
      return null;
    }
    return (
      <ReplyList
        me={this.props.me}
        settings={this.props.settings}
        comment={this.props.comment}
        comments={this.props.comment.localReplies}
        asset={this.props.asset}
        indentLevel={this.props.indentLevel}
        disableReplies
      />
    );
  }
}

const enhanced = withFragmentContainer<InnerProps>({
  me: graphql`
    fragment LocalReplyListContainer_me on User {
      ...CommentContainer_me
    }
  `,
  asset: graphql`
    fragment LocalReplyListContainer_asset on Asset {
      ...CommentContainer_asset
    }
  `,
  comment: graphql`
    fragment LocalReplyListContainer_comment on Comment {
      id
      localReplies {
        id
        ...CommentContainer_comment
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
