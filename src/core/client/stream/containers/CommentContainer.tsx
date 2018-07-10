import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";

import withFragmentContainer from "talk-framework/lib/relay/withFragmentContainer";
import { Omit, PropTypesOf } from "talk-framework/types";
import { CommentContainer as Data } from "talk-stream/__generated__/CommentContainer.graphql";

import Comment, { CommentProps } from "../components/Comment";

type InnerProps = { data: Data } & Omit<CommentProps, keyof Data>;

const CommentContainer: StatelessComponent<InnerProps> = props => {
  const { data, ...rest } = props;
  return <Comment {...rest} {...props.data} />;
};

const enhanced = withFragmentContainer<{ data: Data }>(
  graphql`
    fragment CommentContainer on Comment {
      author {
        username
      }
      createdAt
      body
    }
  `
)(CommentContainer);

export type CommentContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
