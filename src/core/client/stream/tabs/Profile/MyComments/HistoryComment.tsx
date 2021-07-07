import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { GQLSTORY_MODE } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import HTMLContent from "coral-stream/common/HTMLContent";
import Timestamp from "coral-stream/common/Timestamp";
import InReplyTo from "coral-stream/tabs/Comments/Comment/InReplyTo";
import { Hidden, HorizontalGutter, RelativeTime } from "coral-ui/components/v2";
import { StarRating } from "coral-ui/components/v3";

import styles from "./HistoryComment.css";

export interface HistoryCommentProps {
  id: string;
  body: string | null;
  createdAt: string;
  rating: number | null;
  parentAuthorName?: string | null;
  story: {
    metadata: {
      title: string | null;
    } | null;
    settings: {
      mode: string;
    };
  };
  media: React.ReactNode;
  footer: React.ReactNode;
}

const HistoryComment: FunctionComponent<HistoryCommentProps> = (props) => {
  return (
    <HorizontalGutter
      className={cn(styles.root, CLASSES.myComment.$root)}
      data-testid={`historyComment-${props.id}`}
      container="article"
      aria-labelledby={`historyComment-${props.id}-label`}
    >
      <div>
        <Hidden id={`historyComment-${props.id}-label`}>
          Comment <RelativeTime date={props.createdAt} />{" "}
          {props.story.metadata && `on ${props.story.metadata.title}`}
        </Hidden>
        <Localized id="profile-historyComment-comment-on">
          <span className={cn(CLASSES.myComment.commentOn, styles.commentOn)}>
            Comment on:
          </span>
        </Localized>
        <div className={cn(styles.storyTitle, CLASSES.myComment.story)}>
          {props.story.metadata ? props.story.metadata.title : "N/A"}
        </div>
      </div>
      <div>
        <Timestamp className={CLASSES.myComment.timestamp}>
          {props.createdAt}
        </Timestamp>
        {props.parentAuthorName && (
          <div className={styles.subBar}>
            <InReplyTo username={props.parentAuthorName} />
          </div>
        )}
        <HorizontalGutter>
          {props.story.settings.mode === GQLSTORY_MODE.RATINGS_AND_REVIEWS &&
            props.rating && <StarRating rating={props.rating} />}
          <div className={styles.content}>
            {props.body && (
              <HTMLContent className={CLASSES.myComment.content}>
                {props.body}
              </HTMLContent>
            )}
          </div>
          {props.media}
        </HorizontalGutter>
      </div>
      {props.footer}
    </HorizontalGutter>
  );
};

export default HistoryComment;
