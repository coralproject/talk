import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "relay-runtime";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import { ReplyEditedWarningContainer_comment } from "coral-stream/__generated__/ReplyEditedWarningContainer_comment.graphql";

interface Props {
  startedReplyingAt: Date;
  comment: ReplyEditedWarningContainer_comment;
}

const ReplyEditedWarningContainer: FunctionComponent<Props> = ({
  comment,
  startedReplyingAt,
}) => {
  if (!comment.editing.edited) {
    return null;
  }

  if (comment.revision) {
    const revisionDate = new Date(comment.revision.createdAt);
    if (revisionDate < startedReplyingAt) {
      return null;
    }
  }

  return (
    <CallOut
      color="warning"
      icon={<Icon size="xs">warning</Icon>}
      iconColor="none"
    >
      <Localized id="comments-replyChangedWarning-theCommentHasChanged">
        The comment has changed since you started replying to it.
      </Localized>
    </CallOut>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ReplyEditedWarningContainer_comment on Comment {
      editing {
        edited
      }
      revision {
        createdAt
      }
    }
  `,
})(ReplyEditedWarningContainer);

export default enhanced;
