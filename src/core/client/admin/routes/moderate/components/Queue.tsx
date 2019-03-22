import React, { StatelessComponent } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import AutoLoadMoreContainer from "talk-admin/containers/AutoLoadMoreContainer";
import { Flex, HorizontalGutter } from "talk-ui/components";
import { PropTypesOf } from "talk-ui/types";

import ModerateCardContainer from "../containers/ModerateCardContainer";

import styles from "./Queue.css";

interface Props {
  comments: Array<
    { id: string } & PropTypesOf<typeof ModerateCardContainer>["comment"]
  >;
  settings: PropTypesOf<typeof ModerateCardContainer>["settings"];
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  danglingLogic: PropTypesOf<typeof ModerateCardContainer>["danglingLogic"];
}

const Queue: StatelessComponent<Props> = ({
  settings,
  comments,
  hasMore,
  disableLoadMore,
  onLoadMore,
  danglingLogic,
}) => (
  <HorizontalGutter className={styles.root} size="double">
    <TransitionGroup component={null} appear={false} enter={false} exit>
      {comments.map(c => (
        <CSSTransition
          key={c.id}
          timeout={400}
          classNames={{
            exit: styles.exitTransition,
            exitActive: styles.exitTransitionActive,
            exitDone: styles.exitTransitionDone,
          }}
        >
          <ModerateCardContainer
            settings={settings}
            comment={c}
            danglingLogic={danglingLogic}
          />
        </CSSTransition>
      ))}
    </TransitionGroup>
    {hasMore && (
      <Flex justifyContent="center">
        <AutoLoadMoreContainer
          disableLoadMore={disableLoadMore}
          onLoadMore={onLoadMore}
        />
      </Flex>
    )}
  </HorizontalGutter>
);

export default Queue;
