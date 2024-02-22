import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { GQLNOTIFICATION_TYPE } from "coral-common/client/src/core/client/framework/schema/__generated__/types";
import { withFragmentContainer } from "coral-framework/lib/relay";
import HTMLContent from "coral-stream/common/HTMLContent";
import { NOTIFICATION_COMMENT_BODY_LENGTH } from "coral-stream/constants";
import { RelativeTime, Tag } from "coral-ui/components/v2";

import { NotificationCommentContainer_comment } from "coral-stream/__generated__/NotificationCommentContainer_comment.graphql";
import { NotificationCommentContainer_notification } from "coral-stream/__generated__/NotificationCommentContainer_notification.graphql";

import styles from "./NotificationCommentContainer.css";

interface Props {
  comment: NotificationCommentContainer_comment;
  notification: NotificationCommentContainer_notification;
}

const NotificationCommentContainer: FunctionComponent<Props> = ({
  comment,
  notification,
}) => {
  const descriptionText = useMemo(() => {
    if (notification.type === GQLNOTIFICATION_TYPE.COMMENT_FEATURED) {
      return {
        id: "notification-comment-description-featured",
        defaultText: `your comment on "${comment.story.metadata?.title}" was featured by a member of our team.`,
      };
    }
    return {
      id: "notification-comment-description-default",
      defaultText: `on "${comment.story.metadata?.title}"`,
    };
  }, [notification.type, comment.story.metadata?.title]);

  const mediaText = useMemo(() => {
    if (!comment.revision?.media) {
      return null;
    }
    if (comment.revision.media.__typename === "ExternalMedia") {
      return { id: "notification-comment-media-image", defaultText: "Image" };
    } else if (comment.revision.media.__typename === "GiphyMedia") {
      return { id: "notification-comment-media-gif", defaultText: "GIF" };
    } else {
      return { id: "notification-comment-media-embed", defaultText: "Embed" };
    }
  }, [comment.revision?.media]);

  return (
    <>
      <RelativeTime className={styles.timestamp} date={comment.createdAt} />
      {comment.story.metadata?.title && (
        <Localized
          id={`${descriptionText.id}`}
          vars={{ title: comment.story.metadata?.title }}
        >
          <div className={styles.storyTitle}>
            on "{comment.story.metadata.title}"
          </div>
        </Localized>
      )}
      <div className={styles.content}>
        <HTMLContent>
          {comment.body
            ? comment.body.length > NOTIFICATION_COMMENT_BODY_LENGTH
              ? comment.body.slice(0, NOTIFICATION_COMMENT_BODY_LENGTH) + "..."
              : comment.body
            : ""}
        </HTMLContent>
        {mediaText && (
          <div className={styles.media}>
            <Localized id={mediaText.id}>
              <Tag variant="pill">{mediaText.defaultText}</Tag>
            </Localized>
          </div>
        )}
      </div>
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  notification: graphql`
    fragment NotificationCommentContainer_notification on Notification {
      type
    }
  `,
  comment: graphql`
    fragment NotificationCommentContainer_comment on Comment {
      id
      createdAt
      body
      story {
        metadata {
          title
        }
      }
      revision {
        media {
          __typename
        }
      }
    }
  `,
})(NotificationCommentContainer);

export default enhanced;
