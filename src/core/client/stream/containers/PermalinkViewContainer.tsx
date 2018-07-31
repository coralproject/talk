import React from "react";
import { graphql } from "react-relay";
import {
  withFragmentContainer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { AppQueryLocal as Local } from "talk-stream/__generated__/AppQueryLocal.graphql";
import { PermalinkViewContainerQuery as Data } from "talk-stream/__generated__/PermalinkViewContainerQuery.graphql";
import {
  SetCommentIDMutation,
  withSetCommentIDMutation,
} from "talk-stream/mutations";
import PermalinkView from "../components/Permalink/PermalinkView";

interface PermalinkViewContainerProps {
  data: Data;
  local: Local;
  setCommentID: SetCommentIDMutation;
}

class PermalinkViewContainer extends React.Component<
  PermalinkViewContainerProps
> {
  private showAllComments = () => {
    const { local } = this.props;
    window.location.href = local.assetURL!;
    // mutation
  };
  public render() {
    const { data, local } = this.props;
    return (
      <PermalinkView
        {...data}
        assetURL={local.assetURL}
        onShowAllComments={this.showAllComments}
      />
    );
  }
}

const enhanced = withSetCommentIDMutation(
  withFragmentContainer<{ data: Data }>({
    data: graphql`
      fragment PermalinkViewContainerQuery on Query
        @argumentDefinitions(commentID: { type: "ID!" }) {
        comment(id: $commentID) {
          ...CommentContainer
        }
      }
    `,
  })(
    withLocalStateContainer<Local>(
      graphql`
        fragment PermalinkViewContainerLocal on Local {
          assetURL
        }
      `
    )(PermalinkViewContainer)
  )
);

export default enhanced;
