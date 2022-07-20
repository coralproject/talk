import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import key from "keymaster";
import { noop } from "lodash";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { MediaContainer } from "coral-admin/components/MediaContainer";
import { HOTKEYS } from "coral-admin/constants";
import { GQLWordlistMatch } from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";
import {
  Button,
  ButtonIcon,
  Card,
  Flex,
  HorizontalGutter,
  Icon,
  TextLink,
  Timestamp,
} from "coral-ui/components/v2";
import { StarRating } from "coral-ui/components/v3";

import { CommentContent, InReplyTo, UsernameButton } from "../Comment";
import ApproveButton from "./ApproveButton";
import CommentAuthorContainer from "./CommentAuthorContainer";
import FeatureButton from "./FeatureButton";
import MarkersContainer from "./MarkersContainer";
import RejectButton from "./RejectButton";

import styles from "./ModerateCard.css";

interface Props {
  id: string;
  username: string;
  createdAt: string;
  body: string;
  highlight?: boolean;
  inReplyTo?: {
    id: string;
    username: string | null;
  } | null;
  comment: PropTypesOf<typeof MarkersContainer>["comment"] &
    PropTypesOf<typeof CommentAuthorContainer>["comment"] &
    PropTypesOf<typeof MediaContainer>["comment"];
  settings: PropTypesOf<typeof MarkersContainer>["settings"];
  status: "approved" | "rejected" | "undecided";
  featured: boolean;
  moderatedBy: React.ReactNode | null;
  viewContextHref: string;
  showStory: boolean;
  storyTitle?: React.ReactNode;
  storyHref?: string;
  siteName: string | null;
  onModerateStory?: React.EventHandler<React.MouseEvent>;
  onApprove: () => void;
  onReject: () => void;
  onFeature: () => void;
  onUsernameClick: (id?: string) => void;
  onConversationClick: (() => void) | null;
  onFocusOrClick: () => void;
  mini?: boolean;
  hideUsername?: boolean;
  selected?: boolean;
  /**
   * If set to true, it means this comment is about to be removed
   * from the queue. This will trigger some styling changes to
   * reflect that
   */
  dangling?: boolean;
  deleted?: boolean;

  /**
   * If set to true, it means that this comment cannot be moderated by the
   * current user.
   */
  readOnly?: boolean;
  edited: boolean;
  selectPrev?: () => void;
  selectNext?: () => void;
  onBan: () => void;
  isQA?: boolean;
  rating?: number | null;

  bannedWords?: Readonly<Readonly<GQLWordlistMatch>[]>;
  suspectWords?: Readonly<Readonly<GQLWordlistMatch>[]>;
  isArchived?: boolean;
  isArchiving?: boolean;
}

const ModerateCard: FunctionComponent<Props> = ({
  id,
  username,
  createdAt,
  body,
  highlight = false,
  inReplyTo,
  comment,
  settings,
  rating,
  viewContextHref,
  status,
  featured,
  onApprove,
  onReject,
  onFeature,
  onUsernameClick,
  dangling,
  showStory,
  storyTitle,
  storyHref,
  onModerateStory,
  siteName,
  moderatedBy,
  selected,
  onFocusOrClick,
  onConversationClick,
  mini = false,
  hideUsername = false,
  deleted = false,
  readOnly = false,
  edited,
  selectNext,
  selectPrev,
  onBan,
  isQA,
  bannedWords,
  suspectWords,
  isArchived,
  isArchiving,
}) => {
  const div = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) {
      if (selectNext) {
        key(HOTKEYS.NEXT, id, selectNext);
      }
      if (selectPrev) {
        key(HOTKEYS.PREV, id, selectPrev);
      }
      if (onBan) {
        key(HOTKEYS.BAN, id, onBan);
      }
      key(HOTKEYS.APPROVE, id, onApprove);
      key(HOTKEYS.REJECT, id, onReject);

      // The the scope such that only events attached to the ${id} scope will
      // be honored.
      key.setScope(id);

      return () => {
        // Remove all events that are set in the ${id} scope.
        key.deleteScope(id);
      };
    } else {
      // Remove all events that were set in the ${id} scope.
      key.deleteScope(id);
    }

    return noop;
  }, [selected, id, selectNext, selectPrev, onBan, onApprove, onReject]);

  useEffect(() => {
    if (selected && div && div.current) {
      div.current.focus();
    }
  }, [selected, div]);

  const commentBody = useMemo(
    () =>
      deleted ? (
        <Localized id="moderate-comment-deleted-body">
          <div className={styles.deleted}>
            This comment is no longer available. The commenter has deleted their
            account.
          </div>
        </Localized>
      ) : (
        body
      ),
    [deleted, body]
  );

  const commentAuthorClick = useCallback(() => {
    onUsernameClick();
  }, [onUsernameClick]);

  const commentParentAuthorClick = useCallback(() => {
    if (inReplyTo) {
      onUsernameClick(inReplyTo.id);
    }
  }, [onUsernameClick, inReplyTo]);

  return (
    <Card
      className={cn(
        styles.root,
        { [styles.borderless]: mini },
        { [styles.dangling]: dangling },
        { [styles.deleted]: deleted },
        { [styles.selected]: selected }
      )}
      ref={div}
      tabIndex={0}
      data-testid={`moderate-comment-card-${id}`}
      id={`moderate-comment-${id}`}
      onClick={onFocusOrClick}
    >
      <Flex>
        <div className={styles.mainContainer}>
          <div
            className={cn(styles.topBar, {
              [styles.topBarMini]: mini && !inReplyTo,
            })}
          >
            <Flex alignItems="center">
              {!hideUsername && username && (
                <>
                  <UsernameButton
                    username={username}
                    onClick={commentAuthorClick}
                  />
                  <CommentAuthorContainer comment={comment} />
                </>
              )}
              <Timestamp className={styles.timestamp}>{createdAt}</Timestamp>
              {edited && (
                <Localized id="moderate-comment-edited">
                  <span className={styles.edited}>(edited)</span>
                </Localized>
              )}
              <FeatureButton
                featured={featured}
                onClick={onFeature}
                enabled={!deleted && !isQA && !readOnly}
              />
            </Flex>
            {inReplyTo && inReplyTo.username && (
              <InReplyTo onUsernameClick={commentParentAuthorClick}>
                {inReplyTo.username}
              </InReplyTo>
            )}
          </div>
          {rating && (
            <div className={styles.ratingsArea}>
              <StarRating rating={rating} />
            </div>
          )}
          <div className={styles.contentArea}>
            <div className={styles.content}>
              <CommentContent
                highlight={highlight}
                bannedWords={bannedWords}
                suspectWords={suspectWords}
              >
                {commentBody}
              </CommentContent>
              <MediaContainer comment={comment} />
            </div>
            {onConversationClick && (
              <div className={styles.viewContext}>
                <Button iconLeft variant="text" onClick={onConversationClick}>
                  <ButtonIcon>question_answer</ButtonIcon>
                  <Localized id="moderate-comment-viewConversation">
                    <span>View conversation</span>
                  </Localized>
                </Button>
              </div>
            )}
            <div
              className={cn(styles.separator, {
                [styles.ruledSeparator]: !mini,
              })}
            />
          </div>
          <div className={styles.footer}>
            <HorizontalGutter spacing={3}>
              {showStory && (
                <div data-testid="moderate-comment-storyInfo">
                  <div className={styles.storyLabel}>
                    <Localized id="moderate-comment-storyLabel">
                      <span>Comment on</span>
                    </Localized>
                    <span>:</span>
                  </div>
                  <div className={styles.commentOn}>
                    {siteName && (
                      <span className={styles.siteName}>
                        {siteName}
                        <Icon>keyboard_arrow_right</Icon>
                      </span>
                    )}
                    <span className={styles.storyTitle}>{storyTitle}</span>
                  </div>
                  <div>
                    <Localized id="moderate-comment-moderateStory">
                      <TextLink
                        href={storyHref}
                        onClick={onModerateStory}
                        className={styles.link}
                      >
                        Moderate Story
                      </TextLink>
                    </Localized>
                  </div>
                </div>
              )}
              <MarkersContainer
                onUsernameClick={onUsernameClick}
                comment={comment}
                settings={settings}
              />
            </HorizontalGutter>
          </div>
        </div>
        <Flex
          className={cn(styles.aside, {
            [styles.asideWithoutReplyTo]: !inReplyTo,
            [styles.asideMini]: mini && !inReplyTo,
            [styles.asideMiniWithReplyTo]:
              mini && inReplyTo && inReplyTo.username,
          })}
          alignItems="center"
          direction="column"
          itemGutter
        >
          {!mini && (
            <Localized id="moderate-comment-decision">
              <div className={styles.decision}>DECISION</div>
            </Localized>
          )}
          <Flex itemGutter>
            <RejectButton
              onClick={onReject}
              invert={status === "rejected"}
              disabled={
                status === "rejected" ||
                dangling ||
                deleted ||
                readOnly ||
                isArchived ||
                isArchiving
              }
              readOnly={readOnly}
              className={cn({
                [styles.miniButton]: mini,
              })}
            />
            <ApproveButton
              onClick={onApprove}
              invert={status === "approved"}
              disabled={
                status === "approved" ||
                dangling ||
                deleted ||
                readOnly ||
                isArchived ||
                isArchiving
              }
              readOnly={readOnly}
              className={cn({
                [styles.miniButton]: mini,
              })}
            />
          </Flex>
          {moderatedBy}
        </Flex>
      </Flex>
    </Card>
  );
};

export default ModerateCard;
