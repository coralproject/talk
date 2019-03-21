import { Localized } from "fluent-react/compat";
import React, { MouseEvent, StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { Button, Flex, HorizontalGutter, Typography } from "talk-ui/components";

import UserBoxContainer from "talk-stream/containers/UserBoxContainer";
import ReplyListContainer from "talk-stream/tabs/comments/containers/ReplyListContainer";

import ConversationThreadContainer from "../containers/ConversationThreadContainer";

import styles from "./PermalinkView.css";

export interface PermalinkViewProps {
  viewer: PropTypesOf<typeof ConversationThreadContainer>["viewer"] &
    PropTypesOf<typeof ReplyListContainer>["viewer"] &
    PropTypesOf<typeof UserBoxContainer>["viewer"];
  story: PropTypesOf<typeof ConversationThreadContainer>["story"] &
    PropTypesOf<typeof ReplyListContainer>["story"];
  comment:
    | PropTypesOf<typeof ConversationThreadContainer>["comment"] &
        PropTypesOf<typeof ReplyListContainer>["comment"]
    | null;
  settings: PropTypesOf<typeof ConversationThreadContainer>["settings"] &
    PropTypesOf<typeof ReplyListContainer>["settings"] &
    PropTypesOf<typeof UserBoxContainer>["settings"];
  showAllCommentsHref: string | null;
  onShowAllComments: (e: MouseEvent<any>) => void;
}

const PermalinkView: StatelessComponent<PermalinkViewProps> = ({
  showAllCommentsHref,
  comment,
  settings,
  story,
  onShowAllComments,
  viewer,
}) => {
  return (
    <HorizontalGutter className={styles.root} size="double">
      <UserBoxContainer viewer={viewer} settings={settings} />
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
        <HorizontalGutter>
          <ConversationThreadContainer
            viewer={viewer}
            comment={comment}
            story={story}
            settings={settings}
          />
          <div className={styles.replyList}>
            <ReplyListContainer
              viewer={viewer}
              comment={comment}
              story={story}
              settings={settings}
            />
          </div>
        </HorizontalGutter>
      )}
    </HorizontalGutter>
  );
};

export default PermalinkView;
