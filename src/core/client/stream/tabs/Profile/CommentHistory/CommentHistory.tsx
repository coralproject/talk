import { PropTypesOf } from "coral-framework/types";
import { Button, HorizontalGutter, Typography } from "coral-ui/components";
import { Localized } from "fluent-react/compat";
import * as React from "react";
import { FunctionComponent } from "react";

import HistoryCommentContainer from "./HistoryCommentContainer";

interface CommentHistoryProps {
  story: PropTypesOf<typeof HistoryCommentContainer>["story"];
  comments: Array<
    { id: string } & PropTypesOf<typeof HistoryCommentContainer>["comment"]
  >;
  onLoadMore?: () => void;
  hasMore?: boolean;
  disableLoadMore?: boolean;
}

const CommentHistory: FunctionComponent<CommentHistoryProps> = props => {
  return (
    <HorizontalGutter size="double" data-testid="profile-commentHistory">
      <Localized id="profile-historyComment-commentHistory">
        <Typography variant="heading3">Comment History</Typography>
      </Localized>
      {props.comments.map(comment => (
        <HistoryCommentContainer
          key={comment.id}
          story={props.story}
          comment={comment}
        />
      ))}
      {props.hasMore && (
        <Localized id="profile-commentHistory-loadMore">
          <Button
            id={"coral-profile-commentHistory-loadMore"}
            onClick={props.onLoadMore}
            variant="outlined"
            fullWidth
            disabled={props.disableLoadMore}
            aria-controls="coral-profile-commentHistory-log"
          >
            Load More
          </Button>
        </Localized>
      )}
    </HorizontalGutter>
  );
};

export default CommentHistory;
