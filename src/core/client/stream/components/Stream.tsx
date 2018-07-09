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
      {props.comments.map(comment => (
        <div key={comment.id}>
          <CommentContainer data={comment} gutterBottom />
          <ReplyListContainer comment={comment} />
        </div>
      ))}
      {props.hasMore && (
        <Button
          id={"talk-stream--load-more"}
          onClick={props.onLoadMore}
          secondary
          invert
          fullWidth
        >
          Load More
        </Button>
      )}
    </div>
  );
};

export default Stream;
