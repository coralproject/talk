import { Localized } from "fluent-react/compat";
import React, { MouseEvent, StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { Button, Flex, HorizontalGutter, Typography } from "talk-ui/components";

import UserBoxContainer from "../../../containers/UserBoxContainer";
import ConversationThreadContainer from "../containers/ConversationThreadContainer";
import ReplyListContainer from "../containers/ReplyListContainer";
import * as styles from "./PermalinkView.css";

export interface PermalinkViewProps {
  me: PropTypesOf<typeof ConversationThreadContainer>["me"] &
    PropTypesOf<typeof ReplyListContainer>["me"] &
    PropTypesOf<typeof UserBoxContainer>["me"];
  asset: PropTypesOf<typeof ConversationThreadContainer>["asset"] &
    PropTypesOf<typeof ReplyListContainer>["asset"];
  comment:
    | PropTypesOf<typeof ConversationThreadContainer>["comment"] &
        PropTypesOf<typeof ReplyListContainer>["comment"]
    | null;
  settings: PropTypesOf<typeof ConversationThreadContainer>["settings"] &
    PropTypesOf<typeof ReplyListContainer>["settings"];
  showAllCommentsHref: string | null;
  onShowAllComments: (e: MouseEvent<any>) => void;
}

const PermalinkView: StatelessComponent<PermalinkViewProps> = ({
  showAllCommentsHref,
  comment,
  settings,
  asset,
  onShowAllComments,
  me,
}) => {
  return (
    <HorizontalGutter className={styles.root} size="double">
      <UserBoxContainer me={me} />
      <Flex alignItems="center" justifyContent="center" direction="column">
        <Localized id="comments-permalinkView-currentViewing">
          <Typography className={styles.title1}>
            You are currently viewing a
          </Typography>
        </Localized>
        <Localized id="comments-permalinkView-singleConversation">
          <Typography className={styles.title2}>SINGLE CONVERSATION</Typography>
        </Localized>
        {showAllCommentsHref && (
          <Localized id="comments-permalinkView-viewFullDiscussion">
            <Button
              id="talk-comments-permalinkView-viewFullDiscussion"
              variant="underlined"
              color="primary"
              onClick={onShowAllComments}
              href={showAllCommentsHref}
              target="_parent"
              anchor
            >
              View Full Discussion
            </Button>
          </Localized>
        )}
      </Flex>
      {!comment && (
        <Localized id="comments-permalinkView-commentNotFound">
          <Typography>Comment not found</Typography>
        </Localized>
      )}
      {comment && (
        <>
          <ConversationThreadContainer
            me={me}
            comment={comment}
            asset={asset}
            settings={settings}
          />
          <div className={styles.replyList}>
            <ReplyListContainer
              me={me}
              comment={comment}
              asset={asset}
              settings={settings}
            />
          </div>
        </>
      )}
    </HorizontalGutter>
  );
};

export default PermalinkView;
