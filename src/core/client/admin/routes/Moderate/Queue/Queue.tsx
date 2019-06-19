import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import { Button, Flex, HorizontalGutter } from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";

import ModerateCardContainer from "../ModerateCard";

import styles from "./Queue.css";

interface Props {
  comments: Array<
    { id: string } & PropTypesOf<typeof ModerateCardContainer>["comment"]
  >;
  settings: PropTypesOf<typeof ModerateCardContainer>["settings"];
  viewer: PropTypesOf<typeof ModerateCardContainer>["viewer"];
  onLoadMore: () => void;
  onViewMore?: () => void;
  hasLoadMore: boolean;
  disableLoadMore: boolean;
  danglingLogic: PropTypesOf<typeof ModerateCardContainer>["danglingLogic"];
  emptyElement?: React.ReactElement;
  allStories?: boolean;
  viewMoreCount?: number;
}

const Queue: FunctionComponent<Props> = ({
  settings,
  comments,
  hasLoadMore: hasMore,
  disableLoadMore,
  onLoadMore,
  danglingLogic,
  emptyElement,
  allStories,
  viewer,
  viewMoreCount,
  onViewMore,
}) => (
  <HorizontalGutter className={styles.root} size="double">
    {Boolean(viewMoreCount && viewMoreCount > 0) && (
      <Flex justifyContent="center" className={styles.viewMoreButtonContainer}>
        <Localized id="moderate-queue-viewMore" $count={viewMoreCount}>
          <Button
            color="primary"
            variant="filled"
            onClick={onViewMore}
            className={styles.viewMoreButton}
          >
            View {viewMoreCount} more comments
          </Button>
        </Localized>
      </Flex>
    )}
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
            viewer={viewer}
            comment={c}
            danglingLogic={danglingLogic}
            showStoryInfo={Boolean(allStories)}
          />
        </CSSTransition>
      ))}
    </TransitionGroup>
    {hasMore && (
      <Flex justifyContent="center">
        <AutoLoadMore
          disableLoadMore={disableLoadMore}
          onLoadMore={onLoadMore}
        />
      </Flex>
    )}
    {comments.length === 0 && emptyElement}
  </HorizontalGutter>
);

export default Queue;
