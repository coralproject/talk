import { Child as PymChild } from "pym.js";
import qs from "query-string";
import React, { MouseEvent } from "react";
import { graphql } from "react-relay";
import { withContext } from "talk-framework/lib/bootstrap";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { buildURL, parseURL } from "talk-framework/utils";
import { PermalinkViewContainer_comment as CommentData } from "talk-stream/__generated__/PermalinkViewContainer_comment.graphql";
import {
  SetCommentIDMutation,
  withSetCommentIDMutation,
} from "talk-stream/mutations";

import PermalinkView from "../components/PermalinkView";

interface PermalinkViewContainerProps {
  comment: CommentData | null;
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
    const urlParts = parseURL((pym && pym.parentUrl) || window.location.href);
    const search = qs.stringify({
      ...qs.parse(urlParts.search),
      commentID: undefined,
    });
    // Remove the commentId url param.
    return buildURL({ ...urlParts, search });
  }
  public render() {
    const { comment } = this.props;
    return (
      <PermalinkView
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
    withFragmentContainer<{
      comment: CommentData | null;
    }>({
      comment: graphql`
        fragment PermalinkViewContainer_comment on Comment {
          ...CommentContainer
        }
      `,
    })(PermalinkViewContainer)
  )
);

export default enhanced;
