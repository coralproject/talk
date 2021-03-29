import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { graphql } from "react-relay";
import { Virtuoso } from "react-virtuoso";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  useSubscription,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT } from "coral-framework/schema";
import {
  LiveChatRepliesLoadAfterEvent,
  LiveChatRepliesLoadBeforeEvent,
} from "coral-stream/events";
import { Flex } from "coral-ui/components/v2";

import { LiveCommentRepliesContainer_comment } from "coral-stream/__generated__/LiveCommentRepliesContainer_comment.graphql";
import { LiveCommentRepliesContainer_settings } from "coral-stream/__generated__/LiveCommentRepliesContainer_settings.graphql";
import { LiveCommentRepliesContainer_story } from "coral-stream/__generated__/LiveCommentRepliesContainer_story.graphql";
import { LiveCommentRepliesContainer_viewer } from "coral-stream/__generated__/LiveCommentRepliesContainer_viewer.graphql";
import { LiveCommentRepliesContainerAfterCommentEdge } from "coral-stream/__generated__/LiveCommentRepliesContainerAfterCommentEdge.graphql";
import { LiveCommentRepliesContainerBeforeCommentEdge } from "coral-stream/__generated__/LiveCommentRepliesContainerBeforeCommentEdge.graphql";
import { LiveReplyContainer_comment } from "coral-stream/__generated__/LiveReplyContainer_comment.graphql";

import LiveSkeleton from "../../LiveSkeleton";
import LiveReplyCommentEnteredSubscription from "./LiveReplyCommentEnteredSubscription";
import LiveReplyContainer from "./LiveReplyContainer";

import styles from "./LiveCommentRepliesContainer.css";

const START_INDEX = 100000;
const OVERSCAN = { main: 500, reverse: 500 };

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

  tailing: boolean;
  setTailing: (value: boolean) => void;

  onCommentInView: (visible: boolean, commentID: string) => void;

  onEdit: (comment: LiveReplyContainer_comment) => void;
  onCancelEdit: () => void;
  editingCommentID?: string;
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
  tailing,
  setTailing,
  onCommentInView,
  onEdit,
  onCancelEdit,
  editingCommentID,
}) => {
  const { eventEmitter } = useCoralContext();
  const [height, setHeight] = useState(0);
  const subscribeToCommentEntered = useSubscription(
    LiveReplyCommentEnteredSubscription
  );
  useEffect(() => {
    if (afterHasMore) {
      return;
    }
    const disposable = subscribeToCommentEntered({
      storyID: story.id,
      orderBy: GQLCOMMENT_SORT.CREATED_AT_ASC,
      connectionKey: "Replies_after",
      parentID: comment.id,
    });

    return () => {
      disposable.dispose();
    };
  }, [story.id, comment.id, subscribeToCommentEntered, afterHasMore]);

  const handleAtTopStateChange = useCallback(
    (atTop: boolean) => {
      if (atTop && beforeHasMore && !isLoadingMoreBefore) {
        void loadMoreBefore();
        LiveChatRepliesLoadBeforeEvent.emit(eventEmitter, {
          storyID: story.id,
          viewerID: viewer ? viewer.id : "",
        });
      }
    },
    [
      beforeHasMore,
      eventEmitter,
      isLoadingMoreBefore,
      loadMoreBefore,
      story.id,
      viewer,
    ]
  );
  const handleAtBottomStateChange = useCallback(
    (atBottom: boolean) => {
      if (atBottom && afterHasMore && !isLoadingMoreAfter) {
        void loadMoreAfter();
        LiveChatRepliesLoadAfterEvent.emit(eventEmitter, {
          storyID: story.id,
          viewerID: viewer ? viewer.id : "",
        });
      }
      setTailing(atBottom);
    },
    [
      afterHasMore,
      eventEmitter,
      isLoadingMoreAfter,
      loadMoreAfter,
      setTailing,
      story.id,
      viewer,
    ]
  );

  // Render an item or a loading indicator.
  const itemContent = useCallback(
    (index) => {
      index = index - (START_INDEX - beforeComments.length);
      if (index < 0) {
        throw new Error(`Unexpected index < 0, was '${index}'`);
      }
      if (index < beforeComments.length) {
        const e = beforeComments[index];
        return (
          <div key={`chat-reply-${e.node.id}`} className={styles.comment}>
            <Flex justifyContent="flex-start" alignItems="stretch">
              <div className={styles.replyMarker}></div>
              <LiveReplyContainer
                story={story}
                comment={e.node}
                viewer={viewer}
                settings={settings}
                onInView={onCommentInView}
                onEdit={onEdit}
                editing={!!(editingCommentID === e.node.id)}
                onCancelEditing={onCancelEdit}
              />
            </Flex>
          </div>
        );
      } else if (index < beforeComments.length + afterComments.length) {
        const e = afterComments[index - beforeComments.length];
        return (
          <div key={`chat-reply-${e.node.id}`} className={styles.comment}>
            <Flex justifyContent="flex-start" alignItems="stretch">
              <div className={styles.replyMarker}></div>
              <LiveReplyContainer
                story={story}
                comment={e.node}
                viewer={viewer}
                settings={settings}
                onInView={onCommentInView}
                onEdit={onEdit}
                editing={!!(editingCommentID === e.node.id)}
                onCancelEditing={onCancelEdit}
              />
            </Flex>
          </div>
        );
      } else if (index === beforeComments.length + afterComments.length) {
        return <LiveSkeleton />;
      } else {
        throw new Error(`Index out of bounds: ${index}`);
      }
    },
    [
      afterComments,
      beforeComments,
      editingCommentID,
      onCancelEdit,
      onCommentInView,
      onEdit,
      settings,
      story,
      viewer,
    ]
  );

  return (
    <div>
      <div className={styles.comment}>
        <LiveReplyContainer
          story={story}
          comment={comment}
          viewer={viewer}
          settings={settings}
          onInView={onCommentInView}
        />
      </div>
      <Virtuoso
        className={styles.replies}
        style={{ height }}
        firstItemIndex={START_INDEX - beforeComments.length}
        totalCount={
          beforeComments.length +
          afterComments.length +
          (isLoadingMoreAfter ? 1 : 0)
        }
        initialTopMostItemIndex={Math.max(beforeComments.length - 1, 0)}
        itemContent={itemContent}
        alignToBottom
        followOutput="smooth"
        overscan={OVERSCAN}
        atTopStateChange={handleAtTopStateChange}
        atBottomStateChange={handleAtBottomStateChange}
        totalListHeightChanged={(h) => {
          if (height >= 300) {
            return;
          }
          setHeight(h);
        }}
      />
    </div>
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
      id
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
