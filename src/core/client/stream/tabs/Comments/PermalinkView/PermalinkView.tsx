import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, MouseEvent } from "react";

import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import UserBoxContainer from "coral-stream/common/UserBox";
import ReplyListContainer from "coral-stream/tabs/Comments/ReplyList";
import {
  Button,
  CallOut,
  Flex,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";

import ConversationThreadContainer from "./ConversationThreadContainer";

import styles from "./PermalinkView.css";

export interface PermalinkViewProps {
  viewer: PropTypesOf<typeof ConversationThreadContainer>["viewer"] &
    PropTypesOf<typeof ReplyListContainer>["viewer"] &
    PropTypesOf<typeof UserBoxContainer>["viewer"];
  story: PropTypesOf<typeof ConversationThreadContainer>["story"] &
    PropTypesOf<typeof ReplyListContainer>["story"];
  comment:
    | (PropTypesOf<typeof ConversationThreadContainer>["comment"] &
        PropTypesOf<typeof ReplyListContainer>["comment"])
    | null;
  settings: PropTypesOf<typeof ConversationThreadContainer>["settings"] &
    PropTypesOf<typeof ReplyListContainer>["settings"] &
    PropTypesOf<typeof UserBoxContainer>["settings"];
  showAllCommentsHref: string | null;
  onShowAllComments: (e: MouseEvent<any>) => void;
}

const PermalinkView: FunctionComponent<PermalinkViewProps> = ({
  showAllCommentsHref,
  comment,
  settings,
  story,
  onShowAllComments,
  viewer,
}) => {
  return (
    <HorizontalGutter
      className={cn(styles.root, CLASSES.permalinkView.$root, {
        [CLASSES.permalinkView.authenticated]: Boolean(viewer),
        [CLASSES.permalinkView.unauthenticated]: !viewer,
      })}
      size="double"
    >
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
              className={CLASSES.permalinkView.viewFullDiscussionButton}
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
        <CallOut fullWidth>
          <Localized id="comments-permalinkView-commentRemovedOrDoesNotExist">
            <Typography>
              This comment has been removed or does not exist.
            </Typography>
          </Localized>
        </CallOut>
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
              liveDirectRepliesInsertion
              singleConversationView
            />
          </div>
        </HorizontalGutter>
      )}
    </HorizontalGutter>
  );
};

export default PermalinkView;
