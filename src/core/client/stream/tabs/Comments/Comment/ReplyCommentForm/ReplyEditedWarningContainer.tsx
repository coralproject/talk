import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "relay-runtime";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import { ReplyEditedWarningContainer_comment } from "coral-stream/__generated__/ReplyEditedWarningContainer_comment.graphql";

import styles from "./ReplyEditedWarningContainer.css";

interface Props {
  comment: ReplyEditedWarningContainer_comment;
}

const ReplyEditedWarningContainer: FunctionComponent<Props> = ({ comment }) => {
  const openedRevisionID = useMemo(() => {
    return comment.revision!.id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!comment.editing.edited || comment.revision?.id === openedRevisionID) {
    return null;
  }

  return (
    <CallOut
      color="warning"
      icon={
        <Icon size="xs" className={styles.icon}>
          warning
        </Icon>
      }
      iconColor="none"
      title={
        <Localized id="comments-replyChangedWarning-theCommentHasJust">
          <span className={styles.title}>
            This comment has just been edited. The latest version is displayed
            above.
          </span>
        </Localized>
      }
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ReplyEditedWarningContainer_comment on Comment {
      editing {
        edited
      }
      revision {
        id
      }
    }
  `,
})(ReplyEditedWarningContainer);

export default enhanced;
