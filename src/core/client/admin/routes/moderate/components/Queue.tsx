import React, { FunctionComponent } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import AutoLoadMoreContainer from "coral-admin/containers/AutoLoadMoreContainer";
import { Flex, HorizontalGutter } from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";

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
  emptyElement?: React.ReactElement;
  allStories?: boolean;
}

const Queue: FunctionComponent<Props> = ({
  settings,
  comments,
  hasMore,
  disableLoadMore,
  onLoadMore,
  danglingLogic,
  emptyElement,
  allStories,
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
            showStoryInfo={Boolean(allStories)}
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
    {comments.length === 0 && emptyElement}
  </HorizontalGutter>
);

export default Queue;
