import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import {
  BaseButton,
  Card,
  Flex,
  HorizontalGutter,
  TextLink,
} from "coral-ui/components";

import ApproveButton from "./ApproveButton";
import CommentContent from "./CommentContent";
import FeatureButton from "./FeatureButton";
import InReplyTo from "./InReplyTo";
import MarkersContainer from "./MarkersContainer";
import RejectButton from "./RejectButton";
import Timestamp from "./Timestamp";
import Username from "./Username";

import styles from "./ModerateCard.css";

interface Props {
  id: string;
  username: string;
  createdAt: string;
  body: string;
  inReplyTo: string | null;
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
  onUsernameClick: () => void;
  mini?: boolean;
  hideUsername?: boolean;
  /**
   * If set to true, it means this comment is about to be removed
   * from the queue. This will trigger some styling changes to
   * reflect that
   */
  dangling?: boolean;
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
}) => (
  <Card
    className={cn(
      styles.root,
      { [styles.borderless]: mini },
      { [styles.dangling]: dangling }
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
              <BaseButton onClick={onUsernameClick} className={styles.username}>
                <Username>{username}</Username>
              </BaseButton>
            )}
            <Timestamp>{createdAt}</Timestamp>
            <FeatureButton featured={featured} onClick={onFeature} />
          </Flex>
          {inReplyTo && (
            <div>
              <InReplyTo>{inReplyTo}</InReplyTo>
            </div>
          )}
        </div>
        <CommentContent
          suspectWords={suspectWords}
          bannedWords={bannedWords}
          className={styles.content}
        >
          {body}
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
            <MarkersContainer comment={comment} settings={settings} />
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
          [styles.asideMiniWithReplyTo]: mini && inReplyTo,
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
            disabled={status === "rejected" || dangling}
            className={cn({ [styles.miniButton]: mini })}
          />
          <ApproveButton
            onClick={onApprove}
            invert={status === "approved"}
            disabled={status === "approved" || dangling}
            className={cn({ [styles.miniButton]: mini })}
          />
        </Flex>
        {moderatedBy}
      </Flex>
    </Flex>
  </Card>
);

export default ModerateCard;
