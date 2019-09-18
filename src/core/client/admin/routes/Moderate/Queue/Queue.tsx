import { Localized } from "fluent-react/compat";
import key from "keymaster";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import ModerateCardContainer from "coral-admin/components/ModerateCard";
import UserHistoryDrawer from "coral-admin/components/UserHistoryDrawer";
import { ApproveCommentMutation } from "coral-admin/mutations";
import { RejectCommentMutation } from "coral-admin/mutations";
import { MutationProp } from "coral-framework/lib/relay";
import { Button, Flex, HorizontalGutter } from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";

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
  viewNewCount?: number;
  approveComment: MutationProp<typeof ApproveCommentMutation>;
  rejectComment: MutationProp<typeof RejectCommentMutation>;
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
  approveComment,
  rejectComment,
}) => {
  const [userDrawerVisible, setUserDrawerVisible] = useState(false);
  const [userDrawerId, setUserDrawerID] = useState("");
  const [selectedComment, setSelectedComment] = useState<number | null>(0);

  const selectNext = useCallback(
    event => {
      console.log("run select next, current is: ", selectedComment);
      const index = selectedComment || 0;
      const nextComment = comments[index + 1];
      console.log("next", nextComment);
      if (nextComment) {
        setSelectedComment(index + 1);
      }
    },
    [setSelectedComment, comments, selectedComment]
  );

  const selectPrev = useCallback(() => {
    console.log("run select prev, current is: ", selectedComment);
    const index = selectedComment || 0;
    const prevComment = comments[index - 1];
    console.log("prev", prevComment);
    if (prevComment) {
      setSelectedComment(index - 1);
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

  useEffect(() => {
    if (selectedComment) {
      const selected = comments[selectedComment];
      document
        .getElementById(`moderate-comment-${selected.id}`)
        .scrollIntoView();
    }
  }, [selectedComment]);

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
      <UserHistoryDrawer
        open={userDrawerVisible}
        onClose={onHideUserDrawer}
        userID={userDrawerId}
      />
    </HorizontalGutter>
  );
};

export default Queue;
