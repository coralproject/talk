import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";

import { Button, HorizontalGutter } from "talk-ui/components";

import CommentContainer from "../containers/CommentContainer";
import PostCommentFormContainer from "../containers/PostCommentFormContainer";
import ReplyListContainer from "../containers/ReplyListContainer";
import UserBoxContainer from "../containers/UserBoxContainer";
import * as styles from "./Stream.css";

export interface StreamProps {
  assetID: string;
  isClosed?: boolean;
  comments: ReadonlyArray<{ id: string }>;
  onLoadMore?: () => void;
  hasMore?: boolean;
  disableLoadMore?: boolean;
  user: {} | null;
}

const Stream: StatelessComponent<StreamProps> = props => {
  return (
    <HorizontalGutter className={styles.root}>
      <HorizontalGutter size="half">
        <UserBoxContainer user={props.user} />
        <PostCommentFormContainer assetID={props.assetID} />
      </HorizontalGutter>
      <HorizontalGutter
        id="talk-comments-stream-log"
        role="log"
        aria-live="polite"
      >
        {props.comments.map(comment => (
          <HorizontalGutter key={comment.id}>
            <CommentContainer data={comment} />
            <ReplyListContainer comment={comment} />
          </HorizontalGutter>
        ))}
        {props.hasMore && (
          <Localized id="comments-stream-loadMore">
            <Button
              id={"talk-comments-stream-loadMore"}
              onClick={props.onLoadMore}
              variant="outlined"
              fullWidth
              disabled={props.disableLoadMore}
              aria-controls="talk-comments-stream-log"
            >
              Load More
            </Button>
          </Localized>
        )}
      </HorizontalGutter>
    </HorizontalGutter>
  );
};

export default Stream;
