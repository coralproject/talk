import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";

import { Button } from "talk-ui/components";

import CommentContainer from "../containers/CommentContainer";
import PostCommentFormContainer from "../containers/PostCommentFormContainer";
import ReplyListContainer from "../containers/ReplyListContainer";
import Logo from "./Logo";

export interface StreamProps {
  assetID: string;
  isClosed: boolean;
  comments: ReadonlyArray<{ id: string }> | null;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
}

const Stream: StatelessComponent<StreamProps> = props => {
  if (props.comments === null) {
    // TODO: (@cvle) What's the reason for this being null?
    return <div>Comments unavailable</div>;
  }
  return (
    <div>
      <Logo gutterBottom />
      <PostCommentFormContainer assetID={props.assetID} />
      <div id="talk-comments-stream-log" role="log" aria-live="polite">
        {props.comments.map(comment => (
          <div key={comment.id}>
            <CommentContainer data={comment} gutterBottom />
            <ReplyListContainer comment={comment} />
          </div>
        ))}
        {props.hasMore && (
          <Localized id="comments-stream-loadMore">
            <Button
              id={"talk-comments-stream-loadMore"}
              onClick={props.onLoadMore}
              secondary
              invert
              fullWidth
              disabled={props.disableLoadMore}
              aria-controls="talk-comments-stream-log"
            >
              Load More
            </Button>
          </Localized>
        )}
      </div>
    </div>
  );
};

export default Stream;
