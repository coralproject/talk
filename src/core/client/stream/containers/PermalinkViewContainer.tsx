import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { withLocalStateContainer } from "talk-framework/lib/relay";
import { PropTypesOf } from "talk-framework/types";
import { AppQueryLocal as Local } from "talk-stream/__generated__/AppQueryLocal.graphql";
import { PermalinkViewContainerQuery as Data } from "talk-stream/__generated__/PermalinkViewContainerQuery.graphql";
import PermalinkView from "../components/Permalink/PermalinkView";

interface InnerProps {
  data: Data;
  local: Local;
}

export const PermalinkViewContainer: StatelessComponent<InnerProps> = ({
  local,
  data,
}) => {
  return <PermalinkView {...data} assetURL={local.assetURL} />;
};

const enhanced = withFragmentContainer<{ data: Data }>({
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
);

export type PermalinkViewContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
