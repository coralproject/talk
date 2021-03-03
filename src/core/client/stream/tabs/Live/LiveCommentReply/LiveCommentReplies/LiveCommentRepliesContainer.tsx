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
import { LiveCommentRepliesContainerAfterCommentEdge } from "coral-stream/__generated__/LiveCommentRepliesContainerAfterCommentEdge.graphql";
import { LiveCommentRepliesContainerBeforeCommentEdge } from "coral-stream/__generated__/LiveCommentRepliesContainerBeforeCommentEdge.graphql";

import LiveCommentBody from "../../LiveComment/LiveCommentBody";
import LiveReplyCommentEnteredSubscription from "./LiveReplyCommentEnteredSubscription";

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

  storyID: string;
  comment: LiveCommentRepliesContainer_comment;

  setCursor: (cursor: string) => void;
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
  storyID,
  comment,
  setCursor,
}) => {
  const subscribeToCommentEntered = useSubscription(
    LiveReplyCommentEnteredSubscription
  );
  useEffect(() => {
    const disposable = subscribeToCommentEntered({
      storyID,
      orderBy: GQLCOMMENT_SORT.CREATED_AT_ASC,
      connectionKey: "Replies_after",
      parentID: comment.id,
    });

    return () => {
      disposable.dispose();
    };
  }, [storyID, comment.id, subscribeToCommentEntered]);

  const rootRef = useRef<any | null>(null);

  const onScroll = useCallback(async () => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const atBottom =
      Math.abs(root.scrollTop - (root.scrollHeight - root.offsetHeight)) < 5;

    if (atBottom && afterHasMore && !isLoadingMoreAfter) {
      try {
        await loadMoreAfter();
      } catch (err) {
        // ignore for now
      }
    }
  }, [afterHasMore, isLoadingMoreAfter, loadMoreAfter]);

  return (
    <div onScroll={onScroll} className={styles.root} ref={rootRef}>
      <div className={styles.comment}>
        <LiveCommentBody
          author={comment.author}
          body={comment.body}
          createdAt={comment.createdAt}
        />
      </div>
      <div>
        {beforeComments.map((e) => {
          return (
            <div key={`chat-reply-${e.node.id}`} className={styles.comment}>
              <Flex justifyContent="flex-start" alignItems="stretch">
                <div className={styles.replyMarker}></div>
                <LiveCommentBody
                  author={e.node.author}
                  body={e.node.body}
                  createdAt={e.node.createdAt}
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
                <LiveCommentBody
                  author={e.node.author}
                  body={e.node.body}
                  createdAt={e.node.createdAt}
                />
              </Flex>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
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
    }
  `,
})(LiveCommentRepliesContainer);

export default enhanced;
