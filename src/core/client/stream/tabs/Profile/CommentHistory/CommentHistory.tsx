import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import {
  Button,
  Flex,
  HorizontalGutter,
  Icon,
  Typography,
} from "coral-ui/components";

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

const CommentHistory: FunctionComponent<CommentHistoryProps> = props => {
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
            <Typography gutterBottom variant="heading2">
              You have not written any comments
            </Typography>
          </Localized>
          <Localized id="profile-commentHistory-empty-subheading">
            <Typography>A history of your comments will appear here</Typography>
          </Localized>
        </Flex>
      )}
      {props.comments.map(comment => (
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
            variant="outlineFilled"
            fullWidth
            disabled={props.disableLoadMore}
            aria-controls="coral-profile-commentHistory-log"
            className={CLASSES.myCommentsTabPane.loadMoreButton}
          >
            Load More
          </Button>
        </Localized>
      )}
    </HorizontalGutter>
  );
};

export default CommentHistory;
