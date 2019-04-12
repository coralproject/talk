import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import UserBoxContainer from "talk-stream/containers/UserBoxContainer";
import { Button, Flex, HorizontalGutter, Spinner } from "talk-ui/components";

import CommentContainer from "../containers/CommentContainer";
import CommunityGuidelinesContainer from "../containers/CommunityGuidelinesContainer";
import PostCommentFormContainer from "../containers/PostCommentFormContainer";
import ReplyListContainer from "../containers/ReplyListContainer";
import SortMenu from "./SortMenu";

import styles from "./Stream.css";

export interface StreamProps {
  story: {
    id: string;
    isClosed?: boolean;
  } & PropTypesOf<typeof CommentContainer>["story"] &
    PropTypesOf<typeof ReplyListContainer>["story"] &
    PropTypesOf<typeof PostCommentFormContainer>["story"];
  settings: PropTypesOf<typeof CommentContainer>["settings"] &
    PropTypesOf<typeof ReplyListContainer>["settings"] &
    PropTypesOf<typeof UserBoxContainer>["settings"] &
    PropTypesOf<typeof CommunityGuidelinesContainer>["settings"] &
    PropTypesOf<typeof PostCommentFormContainer>["settings"];
  comments: ReadonlyArray<
    { id: string } & PropTypesOf<typeof CommentContainer>["comment"] &
      PropTypesOf<typeof ReplyListContainer>["comment"]
  >;
  onLoadMore?: () => void;
  hasMore?: boolean;
  disableLoadMore?: boolean;
  viewer:
    | PropTypesOf<typeof UserBoxContainer>["viewer"] &
        PropTypesOf<typeof CommentContainer>["viewer"] &
        PropTypesOf<typeof ReplyListContainer>["viewer"]
    | null;
  orderBy: PropTypesOf<typeof SortMenu>["orderBy"];
  onChangeOrderBy: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  refetching?: boolean;
}

const Stream: StatelessComponent<StreamProps> = props => {
  return (
    <HorizontalGutter className={styles.root} size="double">
      <UserBoxContainer viewer={props.viewer} settings={props.settings} />
      <CommunityGuidelinesContainer settings={props.settings} />
      <PostCommentFormContainer settings={props.settings} story={props.story} />
      {props.comments.length > 0 && (
        <SortMenu orderBy={props.orderBy} onChange={props.onChangeOrderBy} />
      )}
      {props.refetching && (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      )}
      {!props.refetching && (
        <HorizontalGutter
          id="talk-comments-stream-log"
          data-testid="comments-stream-log"
          role="log"
          aria-live="polite"
        >
          {props.comments.map(comment => (
            <HorizontalGutter key={comment.id}>
              <CommentContainer
                viewer={props.viewer}
                settings={props.settings}
                comment={comment}
                story={props.story}
              />
              <ReplyListContainer
                settings={props.settings}
                viewer={props.viewer}
                comment={comment}
                story={props.story}
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
