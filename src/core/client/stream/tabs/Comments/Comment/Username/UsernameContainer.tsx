import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { UsernameContainer_comment$key as UsernameContainer_comment } from "coral-stream/__generated__/UsernameContainer_comment.graphql";

import Username from "./Username";

interface Props {
  comment: UsernameContainer_comment;
  className?: string;
}

const UsernameContainer: FunctionComponent<Props> = ({
  comment,
  className,
}) => {
  const commentData = useFragment(
    graphql`
      fragment UsernameContainer_comment on Comment {
        id
        author {
          username
        }
      }
    `,
    comment
  );

  if (!commentData.author) {
    return null;
  }
  return (
    <Username className={className}>{commentData.author.username}</Username>
  );
};

export default UsernameContainer;
