import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { Button, Flex, HorizontalGutter } from "talk-ui/components";

import CommentContainer from "../containers/CommentContainer";
import LocalReplyListContainer from "../containers/LocalReplyListContainer";
import { RootParent } from "./Comment";
import * as styles from "./ConversationThread.css";
import Counter from "./Counter";
import { Circle, Line } from "./Timeline";

export interface ConversationThreadProps {
  className?: string;
  me: PropTypesOf<typeof CommentContainer>["me"] &
    (PropTypesOf<typeof LocalReplyListContainer>["me"] | null);
  asset: PropTypesOf<typeof CommentContainer>["asset"] &
    PropTypesOf<typeof LocalReplyListContainer>["asset"];
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
  return (
    <div className={cn(props.className, styles.root)}>
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
        {props.remaining > 0 && (
          <Circle hollow className={styles.loadMore}>
            <Flex alignItems="center" itemGutter="half">
              <Localized id="comments-conversationThread-showHiddenComments">
                <Button
                  onClick={props.loadMore}
                  disabled={props.disableLoadMore}
                  id="comments-conversationThread-showHiddenComments"
                  variant="underlined"
                >
                  Show hidden comments
                </Button>
              </Localized>
              <Counter>{props.remaining}</Counter>
            </Flex>
          </Circle>
        )}
      </HorizontalGutter>
      <HorizontalGutter container={Line}>
        {props.parents.map((parent, i) => (
          <Circle key={parent.id} hollow={!!props.remaining || i > 0}>
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
            highlight
          />
        </Circle>
      </HorizontalGutter>
    </div>
  );
};

export default ConversationThread;
