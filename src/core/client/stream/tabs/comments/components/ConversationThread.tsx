import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { Button, Flex, HorizontalGutter, Typography } from "talk-ui/components";

import CommentContainer from "../containers/CommentContainer";
import LocalReplyListContainer from "../containers/LocalReplyListContainer";
import { RootParent } from "./Comment";
import * as styles from "./ConversationThread.css";
import { Circle, Line } from "./Timeline";

export interface ConversationThreadProps {
  className?: string;
  me: PropTypesOf<typeof CommentContainer>["me"] &
    (PropTypesOf<typeof LocalReplyListContainer>["me"] | null);
  asset: PropTypesOf<typeof CommentContainer>["asset"] &
    PropTypesOf<typeof LocalReplyListContainer>["asset"];
  comment: PropTypesOf<typeof CommentContainer>["comment"];
  hasMore: boolean;
  disableLoadMore: boolean;
  loadMore: () => void;
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
  return (
    <div className={cn(props.className, styles.root)}>
      <Flex justifyContent="center">
        <Localized id="comments-conversationThread-conversationThread">
          <Typography variant="heading4">Conversation Thread</Typography>
        </Localized>
      </Flex>
      <HorizontalGutter container={<Line dashed />}>
        {props.rootParent && (
          <Circle>
            <RootParent
              id={props.rootParent.id}
              username={props.rootParent.username}
              createdAt={props.rootParent.createdAt}
            />
          </Circle>
        )}
        {props.hasMore && (
          <Circle hollow className={styles.loadMore}>
            <Localized id="comments-conversationThread-viewPreviousComments">
              <Button
                onClick={props.loadMore}
                disabled={props.disableLoadMore}
                id="comments-conversationThread-viewPreviousComments"
                variant="underlined"
              >
                View previous comments
              </Button>
            </Localized>
          </Circle>
        )}
      </HorizontalGutter>
      <HorizontalGutter container={Line}>
        {props.parents.map((parent, i) => (
          <Circle key={parent.id} hollow={props.hasMore || i > 0}>
            <CommentContainer
              comment={parent}
              asset={props.asset}
              me={props.me}
              localReply
            />
            {props.me && (
              <LocalReplyListContainer
                asset={props.asset}
                me={props.me}
                comment={parent}
                indentLevel={1}
              />
            )}
          </Circle>
        ))}
        <Circle end>
          <CommentContainer
            comment={props.comment}
            asset={props.asset}
            me={props.me}
          />
        </Circle>
      </HorizontalGutter>
    </div>
  );
};

export default ConversationThread;
