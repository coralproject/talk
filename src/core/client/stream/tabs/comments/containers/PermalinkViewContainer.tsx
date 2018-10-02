import { Child as PymChild } from "pym.js";
import React, { MouseEvent } from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "talk-framework/helpers";
import { withContext } from "talk-framework/lib/bootstrap";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { PermalinkViewContainer_asset as AssetData } from "talk-stream/__generated__/PermalinkViewContainer_asset.graphql";
import { PermalinkViewContainer_comment as CommentData } from "talk-stream/__generated__/PermalinkViewContainer_comment.graphql";
import { PermalinkViewContainer_me as MeData } from "talk-stream/__generated__/PermalinkViewContainer_me.graphql";
import {
  SetCommentIDMutation,
  withSetCommentIDMutation,
} from "talk-stream/mutations";

import PermalinkView from "../components/PermalinkView";

interface PermalinkViewContainerProps {
  comment: CommentData | null;
  asset: AssetData;
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
      const scrollTo = this.props.comment
        ? document
            .getElementById(`comment-${this.props.comment.id}`)!
            .getBoundingClientRect().top + window.pageYOffset
        : 50;
      setTimeout(() => this.props.pym!.scrollParentToChildPos(scrollTo), 100);
    }
  }

  public render() {
    const { comment, asset, me } = this.props;
    return (
      <PermalinkView
        me={me}
        asset={asset}
        comment={comment}
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
      asset: graphql`
        fragment PermalinkViewContainer_asset on Asset {
          ...CommentContainer_asset
        }
      `,
      comment: graphql`
        fragment PermalinkViewContainer_comment on Comment {
          id
          ...CommentContainer_comment
        }
      `,
      me: graphql`
        fragment PermalinkViewContainer_me on User {
          ...CommentContainer_me
        }
      `,
    })(PermalinkViewContainer)
  )
);

export default enhanced;
