import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { UsernameContainer_comment } from "coral-stream/__generated__/UsernameContainer_comment.graphql";

import Username from "./Username";

interface Props {
  comment: UsernameContainer_comment;
  className?: string;
}

const UsernameContainer: FunctionComponent<Props> = (props) => {
  if (!props.comment.author) {
    return null;
  }
  return (
    <Username className={props.className}>
      {props.comment.author.username}
    </Username>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment UsernameContainer_comment on Comment {
      id
      author {
        username
      }
    }
  `,
})(UsernameContainer);

export default enhanced;
