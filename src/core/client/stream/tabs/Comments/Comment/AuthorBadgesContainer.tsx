import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import withFragmentContainer from "coral-framework/lib/relay/withFragmentContainer";
import { AuthorBadgesContainer_comment as CommentData } from "coral-stream/__generated__/AuthorBadgesContainer_comment.graphql";

import CLASSES from "coral-stream/classes";
import { Tag } from "coral-ui/components";

interface Props {
  comment: CommentData;
}

const AuthorBadgesContainer: FunctionComponent<Props> = ({ comment }) => {
  if (!comment.author || !comment.author.badges) {
    return null;
  }
  return (
    <>
      {comment.author.badges.map(badge => (
        <Tag key={badge} color="dark" className={CLASSES.comment.userBadge}>
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
