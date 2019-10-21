import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import withFragmentContainer from "coral-framework/lib/relay/withFragmentContainer";
import { Tag } from "coral-ui/components";

import { UserTagsContainer_comment } from "coral-stream/__generated__/UserTagsContainer_comment.graphql";
import { UserTagsContainer_settings } from "coral-stream/__generated__/UserTagsContainer_settings.graphql";

interface Props {
  comment: UserTagsContainer_comment;
  settings: UserTagsContainer_settings;
  className?: string;
}

const UserTagsContainer: FunctionComponent<Props> = ({
  settings,
  comment,
  className,
}) => {
  const staffTag = comment.tags.find(t => t.code === "STAFF");
  return (
    <>{staffTag && <Tag className={className}>{settings.staff.label}</Tag>}</>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment UserTagsContainer_comment on Comment {
      tags {
        code
      }
    }
  `,
  settings: graphql`
    fragment UserTagsContainer_settings on Settings {
      staff {
        label
      }
    }
  `,
})(UserTagsContainer);

export default enhanced;
