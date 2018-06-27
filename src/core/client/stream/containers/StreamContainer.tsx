import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "talk-framework/lib/relay";
import { PropTypesOf } from "talk-framework/types";
import { StreamContainer_comments as Data } from "talk-stream/__generated__/StreamContainer_comments.graphql";

import Stream from "../components/Stream";

interface InnerProps {
  comments: Data;
}

const StreamContainer: StatelessComponent<InnerProps> = props => {
  const comments = props.comments.edges.map(edge => edge.node);
  return <Stream comments={comments} />;
};

const enhanced = withFragmentContainer<{ comments: Data }>(
  graphql`
    fragment StreamContainer_comments on CommentsConnection {
      edges {
        node {
          id
          ...CommentContainer
        }
      }
    }
  `
)(StreamContainer);

export type StreamContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
