import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import UserBoxContainer from "talk-stream/containers/UserBoxContainer";
import { Button, HorizontalGutter, Spinner } from "talk-ui/components";

import CommentContainer from "../containers/CommentContainer";
import PostCommentFormContainer from "../containers/PostCommentFormContainer";
import ReplyListContainer from "../containers/ReplyListContainer";
import PostCommentFormFake from "./PostCommentFormFake";
import SortMenu from "./SortMenu";
import * as styles from "./Stream.css";

export interface StreamProps {
  asset: {
    id: string;
    isClosed?: boolean;
  } & PropTypesOf<typeof CommentContainer>["asset"] &
    PropTypesOf<typeof ReplyListContainer>["asset"];
  settings: PropTypesOf<typeof CommentContainer>["settings"] &
    PropTypesOf<typeof ReplyListContainer>["settings"];
  comments: ReadonlyArray<
    { id: string } & PropTypesOf<typeof CommentContainer>["comment"] &
      PropTypesOf<typeof ReplyListContainer>["comment"]
  >;
  onLoadMore?: () => void;
  hasMore?: boolean;
  disableLoadMore?: boolean;
  me:
    | PropTypesOf<typeof UserBoxContainer>["me"] &
        PropTypesOf<typeof CommentContainer>["me"] &
        PropTypesOf<typeof ReplyListContainer>["me"]
    | null;
  orderBy: PropTypesOf<typeof SortMenu>["orderBy"];
  onChangeOrderBy: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  refetching?: boolean;
}

const Stream: StatelessComponent<StreamProps> = props => {
  return (
    <HorizontalGutter className={styles.root} size="double">
      <HorizontalGutter size="half">
        <UserBoxContainer me={props.me} />
        {props.me ? (
          <PostCommentFormContainer assetID={props.asset.id} />
        ) : (
          <PostCommentFormFake />
        )}
      </HorizontalGutter>
      {props.comments.length > 0 && (
        <SortMenu orderBy={props.orderBy} onChange={props.onChangeOrderBy} />
      )}
      {props.refetching && <Spinner />}
      {!props.refetching && (
        <HorizontalGutter
          id="talk-comments-stream-log"
          role="log"
          aria-live="polite"
        >
          {props.comments.map(comment => (
            <HorizontalGutter key={comment.id}>
              <CommentContainer
                me={props.me}
                settings={props.settings}
                comment={comment}
                asset={props.asset}
              />
              <ReplyListContainer
                settings={props.settings}
                me={props.me}
                comment={comment}
                asset={props.asset}
              />
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
      )}
    </HorizontalGutter>
  );
};

export default Stream;
