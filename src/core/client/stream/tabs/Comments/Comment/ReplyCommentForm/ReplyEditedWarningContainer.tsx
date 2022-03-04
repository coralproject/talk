import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import { ReplyEditedWarningContainer_comment$key as ReplyEditedWarningContainer_comment } from "coral-stream/__generated__/ReplyEditedWarningContainer_comment.graphql";

import styles from "./ReplyEditedWarningContainer.css";

interface Props {
  comment: ReplyEditedWarningContainer_comment;
}

const ReplyEditedWarningContainer: FunctionComponent<Props> = ({ comment }) => {
  const commentData = useFragment(
    graphql`
      fragment ReplyEditedWarningContainer_comment on Comment {
        editing {
          edited
        }
        revision {
          id
        }
      }
    `,
    comment
  );

  const openedRevisionID = useMemo(() => {
    return commentData.revision!.id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    !commentData.editing.edited ||
    commentData.revision?.id === openedRevisionID
  ) {
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

export default ReplyEditedWarningContainer;
