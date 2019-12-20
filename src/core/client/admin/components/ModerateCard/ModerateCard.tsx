import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import key from "keymaster";
import { noop } from "lodash";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { HOTKEYS } from "coral-admin/constants";
import { PropTypesOf } from "coral-framework/types";
import {
  BaseButton,
  Card,
  Flex,
  HorizontalGutter,
  TextLink,
  Timestamp,
} from "coral-ui/components/v2";

import ApproveButton from "./ApproveButton";
import CommentAuthorContainer from "./CommentAuthorContainer";
import CommentContent from "./CommentContent";
import FeatureButton from "./FeatureButton";
import InReplyTo from "./InReplyTo";
import MarkersContainer from "./MarkersContainer";
import RejectButton from "./RejectButton";
import Username from "./Username";

import styles from "./ModerateCard.css";

interface Props {
  id: string;
  username: string;
  createdAt: string;
  body: string;
  inReplyTo?: {
    id: string;
    username: string | null;
  } | null;
  comment: PropTypesOf<typeof MarkersContainer>["comment"] &
    PropTypesOf<typeof CommentAuthorContainer>["comment"];
  settings: PropTypesOf<typeof MarkersContainer>["settings"];
  status: "approved" | "rejected" | "undecided";
  featured: boolean;
  moderatedBy: React.ReactNode | null;
  viewContextHref: string;
  suspectWords: ReadonlyArray<string>;
  bannedWords: ReadonlyArray<string>;
  showStory: boolean;
  storyTitle?: React.ReactNode;
  storyHref?: string;
  onModerateStory?: React.EventHandler<React.MouseEvent>;
  onApprove: () => void;
  onReject: () => void;
  onFeature: () => void;
  onUsernameClick: (id?: string) => void;
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
  edited: boolean;
  selectPrev?: () => void;
  selectNext?: () => void;
  onBan: () => void;
}

const ModerateCard: FunctionComponent<Props> = ({
  id,
  username,
  createdAt,
  body,
  inReplyTo,
  comment,
  settings,
  viewContextHref,
  status,
  featured,
  suspectWords,
  bannedWords,
  onApprove,
  onReject,
  onFeature,
  onUsernameClick,
  dangling,
  showStory,
  storyTitle,
  storyHref,
  onModerateStory,
  moderatedBy,
  selected,
  onFocusOrClick,
  mini = false,
  hideUsername = false,
  deleted = false,
  edited,
  selectNext,
  selectPrev,
  onBan,
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
  }, [selected, id]);

  useEffect(() => {
    if (selected && div && div.current) {
      div.current.focus();
    }
  }, [selected]);
  const commentBody = deleted ? (
    <Localized id="moderate-comment-deleted-body">
      <div className={styles.deleted}>
        This comment is no longer available. The commenter has deleted their
        account.
      </div>
    </Localized>
  ) : (
    body
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
      data-testid={`moderate-comment-${id}`}
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
                <BaseButton
                  onClick={commentAuthorClick}
                  className={styles.usernameButton}
                >
                  <Username>{username}</Username>
                </BaseButton>
              )}
              <CommentAuthorContainer comment={comment} />
              <Timestamp>{createdAt}</Timestamp>
              {edited && (
                <Localized id="moderate-comment-edited">
                  <span className={styles.edited}>(edited)</span>
                </Localized>
              )}
              <FeatureButton
                featured={featured}
                onClick={onFeature}
                enabled={!deleted}
              />
            </Flex>
            {inReplyTo && inReplyTo.username && (
              <div className={styles.inReplyTo}>
                <InReplyTo onUsernameClick={commentParentAuthorClick}>
                  {inReplyTo.username}
                </InReplyTo>
              </div>
            )}
          </div>
          <div className={styles.contentArea}>
            <CommentContent
              suspectWords={suspectWords}
              bannedWords={bannedWords}
              className={styles.content}
            >
              {commentBody}
            </CommentContent>
            <div className={styles.viewContext}>
              <Localized id="moderate-comment-viewContext">
                <TextLink
                  className={styles.link}
                  href={viewContextHref}
                  target="_blank"
                >
                  View Context
                </TextLink>
              </Localized>
            </div>
            <div
              className={cn(styles.separator, {
                [styles.ruledSeparator]: !mini,
              })}
            />
          </div>
          <div className={styles.footer}>
            <HorizontalGutter spacing={3}>
              {showStory && (
                <div>
                  <div className={styles.storyLabel}>
                    <Localized id="moderate-comment-storyLabel">
                      <span>Comment on</span>
                    </Localized>
                    <span>:</span>
                  </div>
                  <div className={styles.storyTitle}>{storyTitle}</div>
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
              disabled={status === "rejected" || dangling || deleted}
              className={cn({ [styles.miniButton]: mini })}
            />
            <ApproveButton
              onClick={onApprove}
              invert={status === "approved"}
              disabled={status === "approved" || dangling || deleted}
              className={cn({ [styles.miniButton]: mini })}
            />
          </Flex>
          {moderatedBy}
        </Flex>
      </Flex>
    </Card>
  );
};

export default ModerateCard;
