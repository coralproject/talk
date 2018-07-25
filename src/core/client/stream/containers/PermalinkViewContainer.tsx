import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { PropTypesOf } from "talk-framework/types";
import { PermalinkViewContainerQuery as Data } from "talk-stream/__generated__/PermalinkViewContainerQuery.graphql";
import PermalinkView from "../components/Permalink/PermalinkView";

interface InnerProps {
  data: Data;
}

export const PermalinkViewContainer: StatelessComponent<InnerProps> = props => {
  return <PermalinkView {...props.data} />;
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
})(PermalinkViewContainer);

export type PermalinkViewContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
