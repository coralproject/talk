import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import withFragmentContainer from "coral-framework/lib/relay/withFragmentContainer";
import { UserTagsContainer_comment as CommentData } from "coral-stream/__generated__/UserTagsContainer_comment.graphql";

import { Tag } from "coral-ui/components";

interface Props {
  comment: CommentData;
}

const UserTagsContainer: FunctionComponent<Props> = props => {
  const { comment } = props;
  const staffTag = comment.tags.find(t => t.code === "STAFF");
  return <>{staffTag && <Tag>{staffTag.name}</Tag>}</>;
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment UserTagsContainer_comment on Comment {
      tags {
        name
        code
      }
    }
  `,
})(UserTagsContainer);

export default enhanced;
