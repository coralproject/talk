import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLCOMMENT_STATUS } from "coral-framework/schema";
import HTMLContent from "coral-stream/common/HTMLContent";
import { Timestamp } from "coral-ui/components/v2";

import { NotificationCommentContainer_comment } from "coral-stream/__generated__/NotificationCommentContainer_comment.graphql";

import styles from "./NotificationCommentContainer.css";

interface Props {
  comment: NotificationCommentContainer_comment;
}

const NotificationCommentContainer: FunctionComponent<Props> = ({
  comment,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onToggleOpenClosed = useCallback(() => {
    setIsOpen(!isOpen);
  }, [setIsOpen, isOpen]);

  return (
    <>
      {comment.status === GQLCOMMENT_STATUS.APPROVED && isOpen && (
        <button className={styles.toggle} onClick={onToggleOpenClosed}>
          <Localized id="notification-comment-toggle-approved-open">
            Approved comment
          </Localized>
        </button>
      )}
      {comment.status === GQLCOMMENT_STATUS.APPROVED && !isOpen && (
        <button className={styles.toggle} onClick={onToggleOpenClosed}>
          <Localized id="notification-comment-toggle-approved-closed">
            + Approved comment
          </Localized>
        </button>
      )}
      {comment.status === GQLCOMMENT_STATUS.REJECTED && isOpen && (
        <button className={styles.toggle} onClick={onToggleOpenClosed}>
          <Localized id="notification-comment-toggle-rejected-open">
            Rejected comment
          </Localized>
        </button>
      )}
      {comment.status === GQLCOMMENT_STATUS.REJECTED && !isOpen && (
        <button className={styles.toggle} onClick={onToggleOpenClosed}>
          <Localized id="notification-comment-toggle-rejected-closed">
            + Rejected comment
          </Localized>
        </button>
      )}

      {isOpen && (
        <div className={styles.content}>
          <Timestamp className={styles.timestamp}>
            {comment.createdAt}
          </Timestamp>
          <HTMLContent>{comment.body || ""}</HTMLContent>
          {comment.story.metadata?.title && (
            <div className={styles.storyTitle}>
              {comment.story.metadata.title}
            </div>
          )}
        </div>
      )}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment NotificationCommentContainer_comment on Comment {
      createdAt
      body
      status
      story {
        metadata {
          title
        }
      }
    }
  `,
})(NotificationCommentContainer);

export default enhanced;
