import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { Button, Card, Flex, Icon } from "talk-ui/components";

import MarkersContainer from "../containers/MarkersContainer";
import AcceptButton from "./AcceptButton";
import CommentContent from "./CommentContent";
import InReplyTo from "./InReplyTo";
import styles from "./ModerateCard.css";
import RejectButton from "./RejectButton";
import Timestamp from "./Timestamp";
import Username from "./Username";

interface Props {
  username: string;
  createdAt: string;
  body: string;
  inReplyTo: string | null;
  comment: PropTypesOf<typeof MarkersContainer>["comment"];
  status: "accepted" | "rejected" | "undecided";
  viewContextHref: string;
  suspectWords: ReadonlyArray<string>;
  bannedWords: ReadonlyArray<string>;
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
}) => (
  <Card className={cn(styles.root, { [styles.dangling]: dangling })}>
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
          <Flex justifyContent="flex-end">
            <Button
              variant="underlined"
              color="primary"
              anchor
              href={viewContextHref}
              target="_blank"
            >
              <Localized id="moderate-viewContext">
                <span>View Context</span>
              </Localized>{" "}
              <Icon>arrow_forward</Icon>
            </Button>
          </Flex>
          <Flex itemGutter>
            <MarkersContainer comment={comment} />
          </Flex>
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
