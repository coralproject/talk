import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { PropTypesOf } from "talk-framework/types";
import { Button, HorizontalGutter, Typography } from "talk-ui/components";

import HistoryCommentContainer from "../containers/HistoryCommentContainer";

interface CommentHistoryProps {
  story: PropTypesOf<typeof HistoryCommentContainer>["story"];
  comments: Array<
    { id: string } & PropTypesOf<typeof HistoryCommentContainer>["comment"]
  >;
  onLoadMore?: () => void;
  hasMore?: boolean;
  disableLoadMore?: boolean;
}

const CommentHistory: StatelessComponent<CommentHistoryProps> = props => {
  return (
    <HorizontalGutter size="double">
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
            id={"talk-profile-commentHistory-loadMore"}
            onClick={props.onLoadMore}
            variant="outlined"
            fullWidth
            disabled={props.disableLoadMore}
            aria-controls="talk-profile-commentHistory-log"
          >
            Load More
          </Button>
        </Localized>
      )}
    </HorizontalGutter>
  );
};

export default CommentHistory;
