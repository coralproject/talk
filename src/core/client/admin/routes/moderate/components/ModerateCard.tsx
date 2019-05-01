import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { Card, Flex, HorizontalGutter, TextLink } from "talk-ui/components";

import MarkersContainer from "../containers/MarkersContainer";
import AcceptButton from "./AcceptButton";
import CommentContent from "./CommentContent";
import InReplyTo from "./InReplyTo";
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
  status: "accepted" | "rejected" | "undecided";
  viewContextHref: string;
  suspectWords: ReadonlyArray<string>;
  bannedWords: ReadonlyArray<string>;
  showStory: boolean;
  storyTitle?: React.ReactNode;
  storyHref?: string;
  onModerateStory?: React.EventHandler<React.MouseEvent>;
  onAccept: () => void;
  onReject: () => void;
  /**
   * If set to true, it means this comment is about to be removed
   * from the queue. This will trigger some styling changes to
   * reflect that
   */
  dangling?: boolean;
}

const ModerateCard: StatelessComponent<Props> = ({
  id,
  username,
  createdAt,
  body,
  inReplyTo,
  comment,
  viewContextHref,
  status,
  suspectWords,
  bannedWords,
  onAccept,
  onReject,
  dangling,
  showStory,
  storyTitle,
  storyHref,
  onModerateStory,
}) => (
  <Card
    className={cn(styles.root, { [styles.dangling]: dangling })}
    data-testid={`moderate-comment-${id}`}
  >
    <Flex>
      <div className={styles.mainContainer}>
        <div className={styles.topBar}>
          <div>
            <Username className={styles.username}>{username}</Username>
            <Timestamp>{createdAt}</Timestamp>
          </div>
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
                  external
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
                    target="_blank"
                    onClick={onModerateStory}
                  >
                    Moderate Story
                  </TextLink>
                </Localized>
              </div>
            )}
            <Flex itemGutter>
              <MarkersContainer comment={comment} />
            </Flex>
          </HorizontalGutter>
        </div>
      </div>
      <div className={styles.separator} />
      <Flex
        className={cn(styles.aside, {
          [styles.asideWithoutReplyTo]: !inReplyTo,
        })}
        alignItems="center"
        direction="column"
        itemGutter
      >
        <Localized id="moderate-decision">
          <div className={styles.decision}>DECISION</div>
        </Localized>
        <Flex itemGutter>
          <RejectButton
            onClick={onReject}
            invert={status === "rejected"}
            disabled={status === "rejected" || dangling}
          />
          <AcceptButton
            onClick={onAccept}
            invert={status === "accepted"}
            disabled={status === "accepted" || dangling}
          />
        </Flex>
      </Flex>
    </Flex>
  </Card>
);

export default ModerateCard;
