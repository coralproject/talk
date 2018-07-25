import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";

import { Button, Flex } from "talk-ui/components";

import CommentContainer from "../containers/CommentContainer";
import PostCommentFormContainer from "../containers/PostCommentFormContainer";
import ReplyListContainer from "../containers/ReplyListContainer";
import Logo from "./Logo";
import * as styles from "./Stream.css";

import { Comment, CommentProps } from "talk-stream/components/Comment";

export interface StreamProps {
  assetID: string;
  comment?: CommentProps;
  isClosed?: boolean;
  comments?: ReadonlyArray<{ id: string }>;
  onLoadMore?: () => void;
  hasMore?: boolean;
  disableLoadMore?: boolean;
}

const Stream: StatelessComponent<StreamProps> = props => {
  if (props.comment) {
    return (
      <Flex justifyContent="center" className={styles.root}>
        <Flex direction="column" itemGutter>
          <Comment {...props.comment} />
        </Flex>
      </Flex>
    );
  }

  if (props.comments) {
    return (
      <div className={styles.root}>
        <Logo gutterBottom />
        <PostCommentFormContainer assetID={props.assetID} />
        <Flex
          direction="column"
          id="talk-comments-stream-log"
          role="log"
          aria-live="polite"
          itemGutter
        >
          {props.comments.map(comment => (
            <Flex direction="column" key={comment.id} itemGutter>
              <CommentContainer data={comment} />
              <ReplyListContainer comment={comment} />
            </Flex>
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
        </Flex>
      </div>
    );
  }

  return <div>Error</div>;
};

export default Stream;
