import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { PropTypesOf } from "coral-framework/types";
import {
  BaseButton,
  Card,
  Flex,
  HorizontalGutter,
  TextLink,
  Timestamp,
  Typography,
} from "coral-ui/components";

import ApproveButton from "./ApproveButton";
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
  comment: PropTypesOf<typeof MarkersContainer>["comment"];
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
  mini?: boolean;
  hideUsername?: boolean;
  /**
   * If set to true, it means this comment is about to be removed
   * from the queue. This will trigger some styling changes to
   * reflect that
   */
  dangling?: boolean;
  deleted?: boolean;
  edited: boolean;
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
  mini = false,
  hideUsername = false,
  deleted = false,
  edited,
}) => {
  const commentBody = deleted ? (
    <Localized id="moderate-comment-deleted-body">
      <Typography>
        This comment is no longer available. The commenter has deleted their
        account.
      </Typography>
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
        { [styles.deleted]: deleted }
      )}
      data-testid={`moderate-comment-${id}`}
    >
      <Flex>
        <div className={styles.mainContainer}>
          <div
            className={cn(styles.topBar, {
              [styles.topBarMini]: mini && !inReplyTo,
            })}
          >
            <Flex alignItems="center">
              {!hideUsername && (
                <BaseButton
                  onClick={commentAuthorClick}
                  className={styles.username}
                >
                  <Username>{username}</Username>
                </BaseButton>
              )}
              <Timestamp className={styles.timestamp}>{createdAt}</Timestamp>
              {edited && (
                <Localized id="moderate-comment-edited">
                  <Typography variant="timestamp" className={styles.edited}>
                    (edited)
                  </Typography>
                </Localized>
              )}
              <FeatureButton
                featured={featured}
                onClick={onFeature}
                enabled={!deleted}
              />
            </Flex>
            {inReplyTo && inReplyTo.username && (
              <div>
                <BaseButton
                  onClick={commentParentAuthorClick}
                  className={styles.username}
                >
                  <InReplyTo>{inReplyTo.username}</InReplyTo>
                </BaseButton>
              </div>
            )}
          </div>
          <CommentContent
            suspectWords={suspectWords}
            bannedWords={bannedWords}
            className={styles.content}
          >
            {commentBody}
          </CommentContent>
          <div className={styles.footer}>
            <HorizontalGutter>
              <div>
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
              {showStory && (
                <div>
                  <Localized id="moderate-comment-story">
                    <span className={styles.story}>Story</span>
                  </Localized>
                  {": "}
                  <span className={styles.storyTitle}>{storyTitle}</span>{" "}
                  <Localized id="moderate-comment-moderateStory">
                    <TextLink
                      className={styles.link}
                      href={storyHref}
                      onClick={onModerateStory}
                    >
                      Moderate Story
                    </TextLink>
                  </Localized>
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
        <div
          className={cn(styles.separator, { [styles.ruledSeparator]: !mini })}
        />
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
