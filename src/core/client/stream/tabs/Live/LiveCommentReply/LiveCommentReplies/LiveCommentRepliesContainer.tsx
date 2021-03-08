import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { graphql } from "react-relay";

import {
  useSubscription,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT } from "coral-framework/schema";
import { Flex } from "coral-ui/components/v2";

import { LiveCommentRepliesContainer_comment } from "coral-stream/__generated__/LiveCommentRepliesContainer_comment.graphql";
import { LiveCommentRepliesContainer_settings } from "coral-stream/__generated__/LiveCommentRepliesContainer_settings.graphql";
import { LiveCommentRepliesContainer_story } from "coral-stream/__generated__/LiveCommentRepliesContainer_story.graphql";
import { LiveCommentRepliesContainer_viewer } from "coral-stream/__generated__/LiveCommentRepliesContainer_viewer.graphql";
import { LiveCommentRepliesContainerAfterCommentEdge } from "coral-stream/__generated__/LiveCommentRepliesContainerAfterCommentEdge.graphql";
import { LiveCommentRepliesContainerBeforeCommentEdge } from "coral-stream/__generated__/LiveCommentRepliesContainerBeforeCommentEdge.graphql";

import LiveReplyCommentEnteredSubscription from "./LiveReplyCommentEnteredSubscription";
import LiveReplyContainer from "./LiveReplyContainer";

import styles from "./LiveCommentRepliesContainer.css";

interface Props {
  beforeComments: LiveCommentRepliesContainerBeforeCommentEdge;
  beforeHasMore: boolean;
  loadMoreBefore: () => Promise<void>;
  isLoadingMoreBefore: boolean;

  afterComments: LiveCommentRepliesContainerAfterCommentEdge;
  afterHasMore: boolean;
  loadMoreAfter: () => Promise<void>;
  isLoadingMoreAfter: boolean;

  story: LiveCommentRepliesContainer_story;
  comment: LiveCommentRepliesContainer_comment;
  viewer: LiveCommentRepliesContainer_viewer | null;
  settings: LiveCommentRepliesContainer_settings;
}

const LiveCommentRepliesContainer: FunctionComponent<Props> = ({
  beforeComments,
  beforeHasMore,
  loadMoreBefore,
  isLoadingMoreBefore,
  afterComments,
  afterHasMore,
  loadMoreAfter,
  isLoadingMoreAfter,
  story,
  comment,
  viewer,
  settings,
}) => {
  const subscribeToCommentEntered = useSubscription(
    LiveReplyCommentEnteredSubscription
  );
  useEffect(() => {
    const disposable = subscribeToCommentEntered({
      storyID: story.id,
      orderBy: GQLCOMMENT_SORT.CREATED_AT_ASC,
      connectionKey: "Replies_after",
      parentID: comment.id,
    });

    return () => {
      disposable.dispose();
    };
  }, [story.id, comment.id, subscribeToCommentEntered]);

  const repliesRef = useRef<any | null>(null);

  const onScroll = useCallback(async () => {
    const replies = repliesRef.current;
    if (!replies) {
      return;
    }

    const atBottom =
      Math.abs(
        replies.scrollTop - (replies.scrollHeight - replies.offsetHeight)
      ) < 5;

    const atTop = replies.scrollTop < 5;

    if (atTop && beforeHasMore && !isLoadingMoreBefore && !isLoadingMoreAfter) {
      try {
        await loadMoreBefore();
      } catch (err) {
        // ignore for now
      }
    }
    if (
      atBottom &&
      afterHasMore &&
      !isLoadingMoreAfter &&
      !isLoadingMoreBefore
    ) {
      try {
        await loadMoreAfter();
      } catch (err) {
        // ignore for now
      }
    }
  }, [
    afterHasMore,
    beforeHasMore,
    isLoadingMoreAfter,
    isLoadingMoreBefore,
    loadMoreAfter,
    loadMoreBefore,
  ]);

  return (
    <>
      <div className={styles.comment}>
        <LiveReplyContainer
          story={story}
          comment={comment}
          viewer={viewer}
          settings={settings}
        />
      </div>
      <div onScroll={onScroll} className={styles.replies} ref={repliesRef}>
        {beforeComments.map((e) => {
          return (
            <div key={`chat-reply-${e.node.id}`} className={styles.comment}>
              <Flex justifyContent="flex-start" alignItems="stretch">
                <div className={styles.replyMarker}></div>
                <LiveReplyContainer
                  story={story}
                  comment={e.node}
                  viewer={viewer}
                  settings={settings}
                  cursor={e.cursor}
                />
              </Flex>
            </div>
          );
        })}
        {afterComments.map((e) => {
          return (
            <div key={`chat-reply-${e.node.id}`} className={styles.comment}>
              <Flex justifyContent="flex-start" alignItems="stretch">
                <div className={styles.replyMarker}></div>
                <LiveReplyContainer
                  story={story}
                  comment={e.node}
                  viewer={viewer}
                  settings={settings}
                  cursor={e.cursor}
                />
              </Flex>
            </div>
          );
        })}
      </div>
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment LiveCommentRepliesContainer_story on Story {
      id
      ...LiveReplyContainer_story
    }
  `,
  beforeComments: graphql`
    fragment LiveCommentRepliesContainerBeforeCommentEdge on CommentEdge
      @relay(plural: true) {
      cursor
      node {
        id
        body
        createdAt
        author {
          username
        }
        ...LiveReplyContainer_comment
      }
    }
  `,
  afterComments: graphql`
    fragment LiveCommentRepliesContainerAfterCommentEdge on CommentEdge
      @relay(plural: true) {
      cursor
      node {
        id
        body
        createdAt
        author {
          username
        }
        ...LiveReplyContainer_comment
      }
    }
  `,
  comment: graphql`
    fragment LiveCommentRepliesContainer_comment on Comment {
      id
      body
      createdAt
      author {
        username
      }
      ...LiveReplyContainer_comment
    }
  `,
  viewer: graphql`
    fragment LiveCommentRepliesContainer_viewer on User {
      ...LiveReplyContainer_viewer
    }
  `,
  settings: graphql`
    fragment LiveCommentRepliesContainer_settings on Settings {
      ...LiveReplyContainer_settings
    }
  `,
})(LiveCommentRepliesContainer);

export default enhanced;
