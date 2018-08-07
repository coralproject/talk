import React from "react";
import { graphql } from "react-relay";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { PermalinkViewContainer_asset as AssetData } from "talk-stream/__generated__/PermalinkViewContainer_asset.graphql";
import { PermalinkViewContainer_comment as CommentData } from "talk-stream/__generated__/PermalinkViewContainer_comment.graphql";
import {
  SetCommentIDMutation,
  withSetCommentIDMutation,
} from "talk-stream/mutations";
import PermalinkView from "../components/PermalinkView";

interface PermalinkViewContainerProps {
  comment: CommentData | null;
  asset: AssetData | null;
  setCommentID: SetCommentIDMutation;
}

class PermalinkViewContainer extends React.Component<
  PermalinkViewContainerProps
> {
  private showAllComments = () => {
    this.props.setCommentID({ id: null });
  };
  public render() {
    const { comment, asset } = this.props;
    return (
      <PermalinkView
        comment={comment}
        assetURL={(asset && asset.url) || null}
        onShowAllComments={this.showAllComments}
      />
    );
  }
}

const enhanced = withSetCommentIDMutation(
  withFragmentContainer<{
    comment: CommentData | null;
    asset: AssetData | null;
  }>({
    comment: graphql`
      fragment PermalinkViewContainer_comment on Comment {
        ...CommentContainer
      }
    `,
    asset: graphql`
      fragment PermalinkViewContainer_asset on Asset {
        url
      }
    `,
  })(PermalinkViewContainer)
);

export default enhanced;
