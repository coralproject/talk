import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import HTMLContent from "coral-stream/common/HTMLContent";
import {
  ExternalMedia,
  GiphyMedia,
  TwitterMedia,
  YouTubeMedia,
} from "coral-stream/common/Media";
import { Timestamp } from "coral-ui/components/v2";

import { NotificationCommentContainer_comment } from "coral-stream/__generated__/NotificationCommentContainer_comment.graphql";

import styles from "./NotificationCommentContainer.css";

interface Props {
  comment: NotificationCommentContainer_comment;
  openedStateText?: JSX.Element;
  closedStateText?: JSX.Element;
  expanded?: boolean;
}

const NotificationCommentContainer: FunctionComponent<Props> = ({
  comment,
  openedStateText,
  closedStateText,
  expanded,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(expanded ?? false);

  const onToggleOpenClosed = useCallback(() => {
    setIsOpen(!isOpen);
  }, [setIsOpen, isOpen]);

  return (
    <>
      {isOpen && openedStateText && (
        <button className={styles.toggle} onClick={onToggleOpenClosed}>
          {openedStateText}
        </button>
      )}
      {isOpen && !openedStateText && (
        <button className={styles.toggle} onClick={onToggleOpenClosed}>
          <Localized id="notification-comment-toggle-default-open">
            Comment
          </Localized>
        </button>
      )}
      {!isOpen && closedStateText && (
        <button className={styles.toggle} onClick={onToggleOpenClosed}>
          {closedStateText}
        </button>
      )}
      {!isOpen && !closedStateText && (
        <button className={styles.toggle} onClick={onToggleOpenClosed}>
          <Localized id="notification-comment-toggle-default-closed">
            + Comment
          </Localized>
        </button>
      )}
      {isOpen && (
        <div className={styles.content}>
          <Timestamp className={styles.timestamp}>
            {comment.createdAt}
          </Timestamp>
          <HTMLContent>{comment.body || ""}</HTMLContent>
          <div className={styles.media}>
            {comment.revision?.media?.__typename === "ExternalMedia" && (
              <ExternalMedia
                id={comment.id}
                url={comment.revision?.media?.url}
                siteID={comment.site.id}
                isToggled
              />
            )}
            {comment.revision?.media?.__typename === "TwitterMedia" && (
              <TwitterMedia
                id={comment.id}
                url={comment.revision?.media?.url}
                siteID={comment.site.id}
                isToggled
              />
            )}
            {comment.revision?.media?.__typename === "YouTubeMedia" && (
              <YouTubeMedia
                id={comment.id}
                url={comment.revision?.media?.url}
                siteID={comment.site.id}
                isToggled
              />
            )}
            {comment.revision?.media?.__typename === "GiphyMedia" && (
              <GiphyMedia
                url={comment.revision?.media?.url}
                width={comment.revision?.media?.width}
                height={comment.revision?.media?.height}
                title={comment.revision?.media?.title}
                video={comment.revision?.media?.video}
              />
            )}
          </div>
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
      id
      createdAt
      body
      status
      story {
        metadata {
          title
        }
      }
      site {
        id
      }
      revision {
        media {
          __typename
          ... on GiphyMedia {
            url
            title
            width
            height
            still
            video
          }
          ... on TwitterMedia {
            url
            width
          }
          ... on YouTubeMedia {
            url
            width
            height
          }
          ... on ExternalMedia {
            url
          }
        }
      }
    }
  `,
})(NotificationCommentContainer);

export default enhanced;
