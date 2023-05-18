import { Localized } from "@fluent/react/compat";
import key from "keymaster";
import { noop } from "lodash";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { graphql } from "react-relay";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import BanModalQuery from "coral-admin/components/BanModalQuery";
import ConversationModal from "coral-admin/components/ConversationModal";
import ModerateCardContainer from "coral-admin/components/ModerateCard";
import UserHistoryDrawer from "coral-admin/components/UserHistoryDrawer";
import { HOTKEYS } from "coral-admin/constants";
import {
  ApproveCommentMutation,
  RejectCommentMutation,
} from "coral-admin/mutations";
import { parseModerationOptions } from "coral-framework/helpers";
import useMemoizer from "coral-framework/hooks/useMemoizer";
import { useLocal, useMutation } from "coral-framework/lib/relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { Button, Flex, HorizontalGutter } from "coral-ui/components/v2";
import { useHotkey } from "coral-ui/hooks";
import { PropTypesOf } from "coral-ui/types";

import { QueueLocal } from "coral-admin/__generated__/QueueLocal.graphql";

import QueueWrapper from "./QueueWrapper";

import { useRouter } from "found";
import styles from "./Queue.css";

type CommentType = {
  id: string;
  author: { id: string } | null;
  revision: { id: string } | null;
} & PropTypesOf<typeof ModerateCardContainer>["comment"];

interface Props {
  comments: CommentType[];
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

const QUEUE_HOTKEY_ID = "moderation-queue";

const Queue: FunctionComponent<Props> = ({
  settings,
  comments,
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
  const [showBanModal, setShowBanModal] = useState(false);
  const [userDrawerId, setUserDrawerID] = useState("");
  const [selectedComment, setSelectedComment] = useState<number | null>(-1);
  const [singleView, setSingleView] = useState(false);
  const [conversationModalVisible, setConversationModalVisible] =
    useState(false);
  const [conversationCommentID, setConversationCommentID] = useState("");
  const rejectComment = useMutation(RejectCommentMutation);
  const approveComment = useMutation(ApproveCommentMutation);
  const memoize = useMemoizer();

  const { match } = useRouter();
  const [{ moderationQueueSort }] = useLocal<QueueLocal>(graphql`
    fragment QueueLocal on Local {
      moderationQueueSort
    }
  `);

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

  const selectNext = useCallback(() => {
    const index = selectedCommentRef.current || 0;
    const nextComment = commentsRef.current[index + 1];
    if (nextComment) {
      setSelectedComment(index + 1);
      const container: HTMLElement | null = window.document.getElementById(
        `moderate-comment-${nextComment.id}`
      );
      if (container) {
        container.scrollIntoView();
      }
    }
  }, [window.document]);

  const selectPrev = useCallback(() => {
    const index = selectedCommentRef.current || 0;
    const prevComment = commentsRef.current[index - 1];
    if (prevComment) {
      setSelectedComment(index - 1);
      const container: HTMLElement | null = window.document.getElementById(
        `moderate-comment-${prevComment.id}`
      );
      if (container) {
        container.scrollIntoView();
      }
    }
  }, [window.document]);

  const ban = useCallback(() => {
    if (selectedComment === -1) {
      return;
    }
    setShowBanModal(true);
  }, [showBanModal, selectedComment]);

  useEffect(() => setShowBanModal(false), [selectedComment]);

  const reject = useCallback(async () => {
    const { storyID, siteID, section } = parseModerationOptions(match);
    const comment = comments[selectedComment!];
    if (!comment.revision) {
      return;
    }
    await rejectComment({
      commentID: comment.id,
      commentRevisionID: comment.revision.id,
      storyID,
      siteID,
      section,
      orderBy: moderationQueueSort,
    });
  }, [selectedComment, comments, match, moderationQueueSort, rejectComment]);

  const approve = useCallback(async () => {
    const { storyID, siteID, section } = parseModerationOptions(match);
    const comment = comments[selectedComment!];
    if (!comment.revision) {
      return;
    }
    await approveComment({
      commentID: comment.id,
      commentRevisionID: comment.revision.id,
      storyID,
      siteID,
      section,
      orderBy: moderationQueueSort,
    });
  }, [selectedComment, comments, match, moderationQueueSort, approveComment]);

  useEffect(() => {
    key(HOTKEYS.NEXT, QUEUE_HOTKEY_ID, selectNext);
    key(HOTKEYS.PREV, QUEUE_HOTKEY_ID, selectPrev);
    key(HOTKEYS.BAN, QUEUE_HOTKEY_ID, ban);
    key(HOTKEYS.REJECT, QUEUE_HOTKEY_ID, reject);
    key(HOTKEYS.APPROVE, QUEUE_HOTKEY_ID, approve);

    // The the scope such that only events attached to the ${id} scope will
    // be honored.
    key.setScope(QUEUE_HOTKEY_ID);

    return () => {
      // Remove all events that are set in the ${id} scope.
      key.deleteScope(QUEUE_HOTKEY_ID);
    };

    return noop;
  }, [selectNext, selectPrev, ban, reject, approve]);

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
            handleApprove={approve}
            handleReject={reject}
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
      {showBanModal && (
        <BanModalQuery
          userID={comments[selectedComment!].author!.id}
          onClose={() => setShowBanModal(false)}
          onConfirm={() => setShowBanModal(false)}
        />
      )}
    </HorizontalGutter>
  );
};

export default Queue;
