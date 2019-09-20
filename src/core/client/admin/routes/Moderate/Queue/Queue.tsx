import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import ModerateCardContainer from "coral-admin/components/ModerateCard";
import UserHistoryDrawer from "coral-admin/components/UserHistoryDrawer";
import { Button, Flex, HorizontalGutter } from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";
import { Match, Router, withRouter } from "found";

import styles from "./Queue.css";

interface Props {
  comments: Array<
    { id: string } & PropTypesOf<typeof ModerateCardContainer>["comment"]
  >;
  settings: PropTypesOf<typeof ModerateCardContainer>["settings"];
  viewer: PropTypesOf<typeof ModerateCardContainer>["viewer"];
  onLoadMore: () => void;
  onViewNew?: () => void;
  hasLoadMore: boolean;
  disableLoadMore: boolean;
  danglingLogic: PropTypesOf<typeof ModerateCardContainer>["danglingLogic"];
  emptyElement?: React.ReactElement;
  allStories?: boolean;
  router: Router;
  viewNewCount?: number;
  match: Match;
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
  viewNewCount,
  onViewNew,
  match,
}) => {
  const [userDrawerVisible, setUserDrawerVisible] = useState(false);
  const [userDrawerId, setUserDrawerID] = useState("");
  const [selectedComment, setSelectedComment] = useState<number | null>(0);

  const zenMode =
    match.location.query.count && parseInt(match.location.query.count, 10);

  const selectNext = useCallback(() => {
    const index = selectedComment || 0;
    const nextComment = comments[index + 1];
    if (nextComment) {
      setSelectedComment(index + 1);
      const container: HTMLElement | null = document.getElementById(
        `moderate-comment-${nextComment.id}`
      );
      if (container) {
        container.scrollIntoView();
      }
    }
  }, [setSelectedComment, comments, selectedComment]);

  const selectPrev = useCallback(() => {
    const index = selectedComment || 0;
    const prevComment = comments[index - 1];
    if (prevComment) {
      setSelectedComment(index - 1);
      const container: HTMLElement | null = document.getElementById(
        `moderate-comment-${prevComment.id}`
      );
      if (container) {
        container.scrollIntoView();
      }
    }
  }, [setSelectedComment, comments, selectedComment]);

  const onShowUserDrawer = useCallback(
    (userID: string) => {
      setUserDrawerID(userID);
      setUserDrawerVisible(true);
    },
    [setUserDrawerVisible, setUserDrawerID]
  );

  const onHideUserDrawer = useCallback(() => {
    setUserDrawerVisible(false);
    setUserDrawerID("");
  }, [setUserDrawerVisible, setUserDrawerID]);

  return (
    <HorizontalGutter className={styles.root} size="double">
      {Boolean(viewNewCount && viewNewCount > 0) && (
        <Flex justifyContent="center" className={styles.viewNewButtonContainer}>
          <Localized id="moderate-queue-viewNew" $count={viewNewCount}>
            <Button
              color="primary"
              variant="filled"
              onClick={onViewNew}
              className={styles.viewNewButton}
            >
              View {viewNewCount} new comments
            </Button>
          </Localized>
        </Flex>
      )}
      <TransitionGroup component={null} appear={false} enter={false} exit>
        {comments
          // FIXME (Nick/Wyatt): Investigate why comments are coming back null
          .filter(c => Boolean(c))
          .map((c, i) => (
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
                onUsernameClicked={onShowUserDrawer}
                onSetSelected={() => setSelectedComment(i)}
                selected={selectedComment === i}
                selectPrev={selectPrev}
                selectNext={selectNext}
                loadNext={zenMode ? onLoadMore : null}
              />
            </CSSTransition>
          ))}
      </TransitionGroup>
      {!zenMode && hasMore && (
        <Flex justifyContent="center">
          <AutoLoadMore
            disableLoadMore={disableLoadMore}
            onLoadMore={onLoadMore}
          />
        </Flex>
      )}
      {comments.length === 0 && emptyElement}
      <UserHistoryDrawer
        open={userDrawerVisible}
        onClose={onHideUserDrawer}
        userID={userDrawerId}
      />
    </HorizontalGutter>
  );
};

export default withRouter(Queue);
