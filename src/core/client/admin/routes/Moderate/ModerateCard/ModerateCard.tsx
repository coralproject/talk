import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { Card, Flex, HorizontalGutter, TextLink } from "coral-ui/components";

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
  status: "approved" | "rejected" | "undecided";
  featured: boolean;
  moderatedBy: string | null;
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
  viewContextHref,
  status,
  featured,
  suspectWords,
  bannedWords,
  onApprove,
  onReject,
  onFeature,
  dangling,
  showStory,
  storyTitle,
  storyHref,
  onModerateStory,
  moderatedBy,
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
            <FeatureButton featured={featured} onClick={onFeature} />
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
            <MarkersContainer comment={comment} />
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
        <Localized id="moderate-comment-decision">
          <div className={styles.decision}>DECISION</div>
        </Localized>
        <Flex itemGutter>
          <RejectButton
            onClick={onReject}
            invert={status === "rejected"}
            disabled={status === "rejected" || dangling}
          />
          <ApproveButton
            onClick={onApprove}
            invert={status === "approved"}
            disabled={status === "approved" || dangling}
          />
        </Flex>
        {moderatedBy && (
          <>
            <div>
              <Localized id="moderate-comment-moderatedBy">
                <div className={styles.moderatedBy}>Moderated By</div>
              </Localized>
              <div className={styles.moderatedByUsername}>{moderatedBy}</div>
            </div>
          </>
        )}
      </Flex>
    </Flex>
  </Card>
);

export default ModerateCard;
