import { Localized } from "@fluent/react/compat";
import key from "keymaster";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import ConversationModal from "coral-admin/components/ConversationModal";
import ModerateCardContainer from "coral-admin/components/ModerateCard";
import UserHistoryDrawer from "coral-admin/components/UserHistoryDrawer";
import { HOTKEYS } from "coral-admin/constants";
import useMemoizer from "coral-framework/hooks/useMemoizer";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { Button, Flex, HorizontalGutter } from "coral-ui/components/v2";
import { useHotkey } from "coral-ui/hooks";
import { PropTypesOf } from "coral-ui/types";

import QueueWrapper from "./QueueWrapper";

import styles from "./Queue.css";

interface Props {
  comments: Array<
    {
      id: string;
      site: { id: string };
      author: {
        allCommentsRejected: boolean | null;
        commentsRejectedOnSites: ReadonlyArray<string> | null;
      } | null;
    } & PropTypesOf<typeof ModerateCardContainer>["comment"]
  >;
  settings: PropTypesOf<typeof ModerateCardContainer>["settings"];
  viewer: PropTypesOf<typeof ModerateCardContainer>["viewer"];
  onLoadMore: () => void;
  onViewNew?: () => void;
  hasLoadMore: boolean;
  disableLoadMore: boolean;
  danglingLogic: PropTypesOf<typeof ModerateCardContainer>["danglingLogic"];
  emptyElement?: React.ReactElement;
  showStoryInfo: boolean;
  viewNewCount?: number;
}

const Queue: FunctionComponent<Props> = ({
  settings,
  comments: unfilteredComments,
  viewer,
  hasLoadMore: hasMore,
  disableLoadMore,
  onLoadMore,
  danglingLogic,
  emptyElement,
  showStoryInfo,
  viewNewCount,
  onViewNew,
}) => {
  const { window } = useCoralContext();
  const [userDrawerVisible, setUserDrawerVisible] = useState(false);
  const [userDrawerId, setUserDrawerID] = useState("");
  const [selectedComment, setSelectedComment] = useState<number | null>(-1);
  const [singleView, setSingleView] = useState(false);
  const [conversationModalVisible, setConversationModalVisible] =
    useState(false);
  const [conversationCommentID, setConversationCommentID] = useState("");
  const [hasModerated, setHasModerated] = useState(false);
  const [comments, setComments] = useState<typeof unfilteredComments>([]);
  const memoize = useMemoizer();

  useEffect(() => {
    const filteredComments = unfilteredComments.filter(
      (comment) =>
        !comment.author?.allCommentsRejected &&
        !comment.author?.commentsRejectedOnSites?.includes(comment.site.id)
    );
    setComments(filteredComments);
  }, [unfilteredComments]);

  // So we can register hotkeys for the first comment without immediately pulling focus
  useEffect(() => {
    if (comments.length > 0) {
      key.setScope(comments[0].id);
    }
  }, []);

  const toggleView = useCallback(() => {
    if (!singleView) {
      setSelectedComment(0);
    }
    setSingleView(!singleView);
  }, [singleView]);

  useHotkey(HOTKEYS.ZEN, toggleView);

  // Turn into ref, so we can use them in the callback without
  // creating a new callback when following variables changes.
  const selectedCommentRef = useRef<number | null>(selectedComment);
  selectedCommentRef.current = selectedComment;
  const commentsRef = useRef<Props["comments"]>(comments);
  commentsRef.current = comments;

  useEffect(() => {
    if (selectedComment !== null && commentsRef.current.length > 0) {
      // We've moderated the last comment via hotkey
      if (selectedComment >= commentsRef.current.length) {
        setSelectedComment(commentsRef.current.length - 1);
        // We've moderated the first comment via hotkey
      } else if (selectedComment < 0 && hasModerated) {
        setSelectedComment(0);
      }
    }
  }, [commentsRef.current.length, selectedComment, hasModerated]);

  const varyComment = useCallback(
    (delta: number) => {
      const index = selectedCommentRef.current || 0;
      const targetComment = commentsRef.current[index + delta];
      if (targetComment) {
        setSelectedComment(index + delta);
        const container: HTMLElement | null = window.document.getElementById(
          `moderate-comment-${targetComment.id}`
        );
        if (container) {
          container.scrollIntoView();
        }
      }
    },
    [window.document]
  );

  const selectNext = useCallback(() => varyComment(1), [varyComment]);

  const selectPrev = useCallback(() => varyComment(-1), [varyComment]);

  const onSetUserDrawerUserID = useCallback((userID: string) => {
    setUserDrawerID(userID);
  }, []);

  const onShowUserDrawer = useCallback((userID: string) => {
    setUserDrawerID(userID);
    setUserDrawerVisible(true);
  }, []);

  const onHideUserDrawer = useCallback(() => {
    setUserDrawerVisible(false);
    setUserDrawerID("");
  }, []);

  const onShowConversationModal = useCallback((commentID: string) => {
    setConversationCommentID(commentID);
    setConversationModalVisible(true);
  }, []);

  const onHideConversationModal = useCallback(() => {
    setConversationModalVisible(false);
    setConversationCommentID("");
  }, []);

  const onUsernameClickedFromModal = useCallback((userID: string) => {
    setUserDrawerID(userID);
    setUserDrawerVisible(true);
    setConversationModalVisible(false);
    setConversationCommentID("");
  }, []);

  return (
    <HorizontalGutter className={styles.root} size="double">
      {Boolean(viewNewCount && viewNewCount > 0) && (
        <Flex justifyContent="center" className={styles.viewNewButtonContainer}>
          <Localized
            id="moderate-queue-viewNew"
            vars={{ count: viewNewCount! }}
          >
            <Button onClick={onViewNew} className={styles.viewNewButton}>
              View {viewNewCount} new comments
            </Button>
          </Localized>
        </Flex>
      )}

      <QueueWrapper
        comments={comments}
        singleView={singleView}
        selected={selectedComment}
        card={(comment, i) => (
          <ModerateCardContainer
            key={comment.id}
            settings={settings}
            viewer={viewer}
            comment={comment}
            danglingLogic={danglingLogic}
            showStoryInfo={showStoryInfo}
            onUsernameClicked={onShowUserDrawer}
            onConversationClicked={onShowConversationModal}
            onSetSelected={memoize(i, () => setSelectedComment(i))}
            selected={selectedComment === i}
            selectPrev={selectPrev}
            selectNext={selectNext}
            onModerated={() => setHasModerated(true)}
          />
        )}
      />

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
        setUserID={onSetUserDrawerUserID}
      />
      <ConversationModal
        onUsernameClicked={onUsernameClickedFromModal}
        open={conversationModalVisible}
        onClose={onHideConversationModal}
        commentID={conversationCommentID}
      />
    </HorizontalGutter>
  );
};

export default Queue;
