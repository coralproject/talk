import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import withFragmentContainer from "coral-framework/lib/relay/withFragmentContainer";
import { Tag } from "coral-ui/components/v2";

import { AuthorBadgesContainer_comment as CommentData } from "coral-stream/__generated__/AuthorBadgesContainer_comment.graphql";

interface Props {
  comment: CommentData;
  className?: string;
}

const AuthorBadgesContainer: FunctionComponent<Props> = ({
  comment,
  className,
}) => {
  if (!comment.author || !comment.author.badges) {
    return null;
  }
  return (
    <>
      {comment.author.badges.map((badge) => (
        <Tag key={badge} color="dark" className={className}>
          {badge}
        </Tag>
      ))}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment AuthorBadgesContainer_comment on Comment {
      author {
        badges
      }
    }
  `,
})(AuthorBadgesContainer);

export default enhanced;
