import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";

import withFragmentContainer from "talk-framework/lib/relay/withFragmentContainer";
import { PropTypesOf } from "talk-framework/types";
import { CommentContainer as Data } from "talk-stream/__generated__/CommentContainer.graphql";

import Comment from "../components/Comment";

interface InnerProps {
  data: Data;
}

// tslint:disable-next-line:no-unused-expression
graphql`
  fragment CommentContainer_comment on Comment {
    id
    author {
      username
    }
    body
    createdAt
  }
`;

export const CommentContainer: StatelessComponent<InnerProps> = props => {
  const { data, ...rest } = props;
  return <Comment {...rest} {...props.data} />;
};

const enhanced = withFragmentContainer<{ data: Data }>({
  data: graphql`
    fragment CommentContainer on Comment {
      ...CommentContainer_comment @relay(mask: false)
    }
  `,
})(CommentContainer);

export type CommentContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
