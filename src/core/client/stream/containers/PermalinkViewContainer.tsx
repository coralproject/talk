import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "talk-framework/lib/relay";
import { PropTypesOf } from "talk-framework/types";

import PermalinkView from "../components/PermalinkView";

import { PermalinkViewContainer as Data } from "talk-stream/__generated__/PermalinkViewContainer.graphql";

interface InnerProps {
  data: Data;
}

export const PermalinkViewContainer: StatelessComponent<InnerProps> = props => {
  console.log("App query render", props);
  return <PermalinkView {...props.data} />;
};

const enhanced = withFragmentContainer<{ data: Data }>({
  data: graphql`
    fragment PermalinkViewContainer on Query
      @argumentDefinitions(commentID: { type: "ID!" }) {
      comment(id: $commentID) {
        id
        body
        author {
          username
        }
        createdAt
      }
    }
  `,
})(PermalinkViewContainer);

export type PermalinkViewContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
