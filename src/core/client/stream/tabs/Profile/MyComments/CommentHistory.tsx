import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { Button, Flex, HorizontalGutter, Icon } from "coral-ui/components/v2";

import HistoryCommentContainer from "./HistoryCommentContainer";

import styles from "./CommentHistory.css";

interface CommentHistoryProps {
  story: PropTypesOf<typeof HistoryCommentContainer>["story"];
  settings: PropTypesOf<typeof HistoryCommentContainer>["settings"];
  comments: Array<
    { id: string } & PropTypesOf<typeof HistoryCommentContainer>["comment"]
  >;
  onLoadMore?: () => void;
  hasMore?: boolean;
  disableLoadMore?: boolean;
}

const CommentHistory: FunctionComponent<CommentHistoryProps> = (props) => {
  return (
    <HorizontalGutter
      size="double"
      id="coral-profile-commentHistory-log"
      data-testid="profile-commentHistory"
    >
      {props.comments.length < 1 && (
        <Flex
          direction="column"
          alignItems="center"
          className={styles.emptyHistory}
        >
          <div className={styles.emptyHistoryIcon}>
            <Icon size="xl">chat_bubble_outline</Icon>
          </div>
          <Localized id="profile-commentHistory-empty">
            <span className={styles.emptyHistoryHeader}>
              You have not written any comments
            </span>
          </Localized>
          <Localized id="profile-commentHistory-empty-subheading">
            <span className={styles.emptyHistorySubHeader}>
              A history of your comments will appear here
            </span>
          </Localized>
        </Flex>
      )}
      {props.comments.map((comment) => (
        <HistoryCommentContainer
          key={comment.id}
          story={props.story}
          settings={props.settings}
          comment={comment}
        />
      ))}
      {props.hasMore && (
        <Localized id="profile-commentHistory-loadMore">
          <Button
            id={"coral-profile-commentHistory-loadMore"}
            onClick={props.onLoadMore}
            variant="outline"
            color="regular"
            fullWidth
            disabled={props.disableLoadMore}
            aria-controls="coral-profile-commentHistory-log"
            className={CLASSES.myCommentsTabPane.loadMoreButton}
            classes={{
              variantOutline: styles.loadMore,
              disabled: styles.disabled,
              mouseHover: styles.mouseHover,
              active: styles.active,
              colorRegular: styles.colorRegular,
            }}
          >
            Load More
          </Button>
        </Localized>
      )}
    </HorizontalGutter>
  );
};

export default CommentHistory;
