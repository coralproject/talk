import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { GQLSTORY_MODE } from "coral-framework/schema";
import { CommentContainer_comment as CommentData } from "coral-stream/__generated__/CommentContainer_comment.graphql";
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
  parent: CommentData["parent"];
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
  const storyTitle = props.story.metadata ? props.story.metadata.title : "N/A";
  return (
    <HorizontalGutter
      className={cn(styles.root, CLASSES.myComment.$root)}
      data-testid={`historyComment-${props.id}`}
      container="article"
      aria-labelledby={`historyComment-${props.id}-label`}
    >
      <div data-testid={`profile-historyComment-${props.id}-onStory`}>
        <Localized
          id="profile-historyComment-commentLabel"
          elems={{ RelativeTime: <RelativeTime date={props.createdAt} /> }}
          vars={{ storyTitle: storyTitle ?? "" }}
        >
          <Hidden id={`historyComment-${props.id}-label`}>
            Comment <RelativeTime date={props.createdAt} /> on {storyTitle}
          </Hidden>
        </Localized>
        <Localized id="profile-historyComment-comment-on">
          <span className={cn(CLASSES.myComment.commentOn, styles.commentOn)}>
            Comment on:
          </span>
        </Localized>
        <div className={cn(styles.storyTitle, CLASSES.myComment.story)}>
          {storyTitle}
        </div>
      </div>
      <div>
        <Timestamp className={CLASSES.myComment.timestamp}>
          {props.createdAt}
        </Timestamp>
        {props.parent?.author?.username && (
          <div className={styles.subBar}>
            <InReplyTo parent={props.parent} enableJumpToParent={false} />
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
