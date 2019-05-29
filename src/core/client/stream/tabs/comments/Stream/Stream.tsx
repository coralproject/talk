import { Localized } from "fluent-react/compat";
import * as React from "react";
import { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import UserBoxContainer from "coral-stream/common/UserBox";
import { Button, Flex, HorizontalGutter, Spinner } from "coral-ui/components";

import CommentContainer from "../Comment";
import ReplyListContainer from "../ReplyList";
import CommunityGuidelinesContainer from "./CommunityGuidelines";
import PostCommentFormContainer from "./PostCommentForm";
import SortMenu from "./SortMenu";

import BannedInfo from "./BannedInfo";
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
    PropTypesOf<typeof PostCommentFormContainer>["settings"] & {
      reaction: {
        sortLabel: string;
      };
    };
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
  banned?: boolean;
}

const Stream: FunctionComponent<StreamProps> = props => {
  return (
    <HorizontalGutter className={styles.root} size="double">
      <UserBoxContainer viewer={props.viewer} settings={props.settings} />
      <CommunityGuidelinesContainer settings={props.settings} />
      {!props.banned && (
        <PostCommentFormContainer
          settings={props.settings}
          story={props.story}
        />
      )}
      {props.banned && <BannedInfo />}
      {props.comments.length > 0 && (
        <SortMenu
          orderBy={props.orderBy}
          onChange={props.onChangeOrderBy}
          reactionSortLabel={props.settings.reaction.sortLabel}
        />
      )}
      {props.refetching && (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      )}
      {!props.refetching && (
        <HorizontalGutter
          id="coral-comments-stream-log"
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
                id={"coral-comments-stream-loadMore"}
                onClick={props.onLoadMore}
                variant="outlined"
                fullWidth
                disabled={props.disableLoadMore}
                aria-controls="coral-comments-stream-log"
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
