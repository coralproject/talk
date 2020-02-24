import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { Child as PymChild } from "pym.js";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { withContext } from "coral-framework/lib/bootstrap";
import { useViewerNetworkEvent } from "coral-framework/lib/events";
import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import Counter from "coral-stream/common/Counter";
import { ShowMoreOfConversationEvent } from "coral-stream/events";
import {
  SetCommentIDMutation,
  withSetCommentIDMutation,
} from "coral-stream/mutations";
import {
  CommentContainer,
  RootParent,
  UserTagsContainer,
} from "coral-stream/tabs/Comments/Comment";
import LocalReplyListContainer from "coral-stream/tabs/Comments/ReplyList/LocalReplyListContainer";
import { Button, Flex, HorizontalGutter } from "coral-ui/components";

import { ConversationThreadContainer_comment as CommentData } from "coral-stream/__generated__/ConversationThreadContainer_comment.graphql";
import { ConversationThreadContainer_settings as SettingsData } from "coral-stream/__generated__/ConversationThreadContainer_settings.graphql";
import { ConversationThreadContainer_story as StoryData } from "coral-stream/__generated__/ConversationThreadContainer_story.graphql";
import { ConversationThreadContainer_viewer as ViewerData } from "coral-stream/__generated__/ConversationThreadContainer_viewer.graphql";
import { ConversationThreadContainerPaginationQueryVariables } from "coral-stream/__generated__/ConversationThreadContainerPaginationQuery.graphql";

import { Circle, Line } from "./Timeline";

import styles from "./ConversationThreadContainer.css";

interface Props {
  comment: CommentData;
  story: StoryData;
  settings: SettingsData;
  viewer: ViewerData | null;
  setCommentID: SetCommentIDMutation;
  pym: PymChild | undefined;
  relay: RelayPaginationProp;
}

const ConversationThreadContainer: FunctionComponent<Props> = ({
  comment,
  story,
  viewer,
  settings,
  relay,
}) => {
  const [loadMore, isLoadingMore] = useLoadMore(relay, 5);
  const beginLoadMoreEvent = useViewerNetworkEvent(ShowMoreOfConversationEvent);
  const loadMoreAndEmit = useCallback(async () => {
    const loadMoreEvent = beginLoadMoreEvent({ commentID: comment.id });
    try {
      await loadMore();
      loadMoreEvent.success();
    } catch (error) {
      loadMoreEvent.error({ message: error.message, code: error.code });
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [loadMore, beginLoadMoreEvent]);
  const parents = comment.parents.edges.map(edge => edge.node);
  const remaining = comment.parentCount - comment.parents.edges.length;
  const hasMore = relay.hasMore();
  const rootParent = hasMore && comment && comment.rootParent;

  const dataTestID = "comments-permalinkView-conversationThread";
  if (remaining === 0 && parents.length === 0) {
    return (
      <div className={styles.root} data-testid={dataTestID}>
        <CommentContainer
          comment={comment}
          story={story}
          settings={settings}
          viewer={viewer}
          highlight
        />
      </div>
    );
  }
  return (
    <div
      className={cn(CLASSES.conversationThread.$root, styles.root)}
      data-testid={dataTestID}
    >
      <HorizontalGutter container={<Line dotted />}>
        {rootParent && (
          <Circle>
            <RootParent
              id={rootParent.id}
              username={rootParent.author && rootParent.author.username}
              createdAt={rootParent.createdAt}
              tags={
                <UserTagsContainer
                  className={CLASSES.conversationThread.rootParent.userTag}
                  story={story}
                  comment={rootParent}
                  settings={settings}
                />
              }
            />
          </Circle>
        )}
        {remaining > 0 && (
          <Circle hollow className={styles.loadMore}>
            <Flex alignItems="center" itemGutter="half">
              <Localized
                id="comments-conversationThread-showMoreOfThisConversation"
                $count={remaining}
              >
                <Button
                  className={cn(
                    CLASSES.conversationThread.showMore,
                    styles.showMoreButton
                  )}
                  onClick={loadMoreAndEmit}
                  disabled={isLoadingMore}
                  variant="underlined"
                >
                  Show more of this conversation
                </Button>
              </Localized>
              {remaining > 1 && <Counter color="dark">{remaining}</Counter>}
            </Flex>
          </Circle>
        )}
      </HorizontalGutter>
      <HorizontalGutter container={Line}>
        {parents.map((parent, i) => (
          <Circle key={parent.id} hollow={!!remaining || i > 0}>
            <CommentContainer
              comment={parent}
              story={story}
              viewer={viewer}
              settings={settings}
              localReply
            />
            {viewer && (
              <LocalReplyListContainer
                story={story}
                viewer={viewer}
                settings={settings}
                comment={parent}
                indentLevel={1}
              />
            )}
          </Circle>
        ))}
        <Circle end>
          <CommentContainer
            className={CLASSES.conversationThread.hightlighted}
            comment={comment}
            story={story}
            settings={settings}
            viewer={viewer}
            highlight
          />
        </Circle>
      </HorizontalGutter>
    </div>
  );
};

// TODO: (cvle) This should be autogenerated.
interface FragmentVariables {
  count: number;
  cursor?: string;
}

const enhanced = withContext(ctx => ({
  pym: ctx.pym,
}))(
  withSetCommentIDMutation(
    withPaginationContainer<
      Props,
      ConversationThreadContainerPaginationQueryVariables,
      FragmentVariables
    >(
      {
        story: graphql`
          fragment ConversationThreadContainer_story on Story {
            ...CommentContainer_story
            ...LocalReplyListContainer_story
            ...UserTagsContainer_story
          }
        `,
        settings: graphql`
          fragment ConversationThreadContainer_settings on Settings {
            ...CommentContainer_settings
            ...LocalReplyListContainer_settings
            ...UserTagsContainer_settings
          }
        `,
        comment: graphql`
          fragment ConversationThreadContainer_comment on Comment
            @argumentDefinitions(
              count: { type: "Int!", defaultValue: 0 }
              cursor: { type: "Cursor" }
            ) {
            id
            ...CommentContainer_comment
            rootParent {
              id
              author {
                id
                username
              }
              createdAt
              ...UserTagsContainer_comment
            }
            parentCount
            parents(last: $count, before: $cursor)
              @connection(key: "ConversationThread_parents") {
              edges {
                node {
                  id
                  ...CommentContainer_comment
                  ...LocalReplyListContainer_comment
                }
              }
            }
          }
        `,
        viewer: graphql`
          fragment ConversationThreadContainer_viewer on User {
            ...CommentContainer_viewer
            ...LocalReplyListContainer_viewer
          }
        `,
      },
      {
        direction: "backward",
        getConnectionFromProps(props) {
          return props.comment && props.comment.parents;
        },
        // This is also the default implementation of `getFragmentVariables` if it isn't provided.
        getFragmentVariables(prevVars, totalCount) {
          return {
            ...prevVars,
            count: totalCount,
          };
        },
        getVariables(props, { count, cursor }) {
          return {
            count,
            cursor,
            // commentID isn't specified as an @argument for the fragment, but it should be a
            // variable available for the fragment under the query root.
            commentID: props.comment.id,
          };
        },
        query: graphql`
          # Pagination query to be fetched upon calling 'loadMore'.
          # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
          query ConversationThreadContainerPaginationQuery(
            $count: Int!
            $cursor: Cursor
            $commentID: ID!
          ) {
            comment(id: $commentID) {
              ...ConversationThreadContainer_comment
                @arguments(count: $count, cursor: $cursor)
            }
          }
        `,
      }
    )(ConversationThreadContainer)
  )
);

export default enhanced;
