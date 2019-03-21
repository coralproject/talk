import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { Button, Counter, Flex, HorizontalGutter } from "talk-ui/components";

import { RootParent } from "talk-stream/tabs/comments/components/Comment";
import CommentContainer from "talk-stream/tabs/comments/containers/CommentContainer";
import LocalReplyListContainer from "talk-stream/tabs/comments/containers/LocalReplyListContainer";

import styles from "./ConversationThread.css";
import { Circle, Line } from "./Timeline";

export interface ConversationThreadProps {
  className?: string;
  viewer: PropTypesOf<typeof CommentContainer>["viewer"] &
    (PropTypesOf<typeof LocalReplyListContainer>["viewer"] | null);
  story: PropTypesOf<typeof CommentContainer>["story"] &
    PropTypesOf<typeof LocalReplyListContainer>["story"];
  settings: PropTypesOf<typeof CommentContainer>["settings"] &
    PropTypesOf<typeof LocalReplyListContainer>["settings"];
  comment: PropTypesOf<typeof CommentContainer>["comment"];
  disableLoadMore: boolean;
  loadMore: () => void;
  remaining: number;
  parents: Array<
    { id: string } & PropTypesOf<typeof CommentContainer>["comment"] &
      PropTypesOf<typeof LocalReplyListContainer>["comment"]
  >;
  rootParent: {
    id: string;
    createdAt: string;
    username: string | null;
  } | null;
}

const ConversationThread: StatelessComponent<
  ConversationThreadProps
> = props => {
  const dataTestID = "comments-permalinkView-conversationThread";
  if (props.remaining === 0 && props.parents.length === 0) {
    return (
      <div
        className={cn(props.className, styles.root)}
        data-testid={dataTestID}
      >
        <CommentContainer
          comment={props.comment}
          story={props.story}
          settings={props.settings}
          viewer={props.viewer}
          highlight
        />
      </div>
    );
  }
  return (
    <div className={cn(props.className, styles.root)} data-testid={dataTestID}>
      <HorizontalGutter container={<Line dotted />}>
        {props.rootParent && (
          <Circle>
            <RootParent
              id={props.rootParent.id}
              username={props.rootParent.username}
              createdAt={props.rootParent.createdAt}
            />
          </Circle>
        )}
        {props.remaining > 0 && (
          <Circle hollow className={styles.loadMore}>
            <Flex alignItems="center" itemGutter="half">
              <Localized
                id="comments-conversationThread-showMoreOfThisConversation"
                $count={props.remaining}
              >
                <Button
                  className={styles.showMoreButton}
                  onClick={props.loadMore}
                  disabled={props.disableLoadMore}
                  variant="underlined"
                >
                  Show more of this conversation
                </Button>
              </Localized>
              {props.remaining > 1 && <Counter>{props.remaining}</Counter>}
            </Flex>
          </Circle>
        )}
      </HorizontalGutter>
      <HorizontalGutter container={Line}>
        {props.parents.map((parent, i) => (
          <Circle key={parent.id} hollow={!!props.remaining || i > 0}>
            <CommentContainer
              comment={parent}
              story={props.story}
              viewer={props.viewer}
              settings={props.settings}
              localReply
            />
            {props.viewer && (
              <LocalReplyListContainer
                story={props.story}
                viewer={props.viewer}
                settings={props.settings}
                comment={parent}
                indentLevel={1}
              />
            )}
          </Circle>
        ))}
        <Circle end>
          <CommentContainer
            comment={props.comment}
            story={props.story}
            settings={props.settings}
            viewer={props.viewer}
            highlight
          />
        </Circle>
      </HorizontalGutter>
    </div>
  );
};

export default ConversationThread;
