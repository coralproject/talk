import * as React from "react";
import { StatelessComponent } from "react";

import Logo from "talk-stream/components/Logo";
import CommentContainer from "talk-stream/containers/CommentContainer";
import PostCommentFormContainer from "talk-stream/containers/PostCommentFormContainer";
import { Button } from "talk-ui/components";

export interface StreamProps {
  id: string;
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
      <PostCommentFormContainer assetID={props.id} />
      {props.comments.map(comment => (
        <CommentContainer key={comment.id} data={comment} gutterBottom />
      ))}
      {props.hasMore && (
        <Button
          id={"talk-stream--loadmore"}
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
