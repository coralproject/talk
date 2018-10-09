import { Localized } from "fluent-react/compat";
import React, { MouseEvent, StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { Button, Flex, Typography } from "talk-ui/components";

import ReplyListContainer from "talk-stream/tabs/comments/containers/ReplyListContainer";
import ConversationThreadContainer from "../containers/ConversationThreadContainer";
import * as styles from "./PermalinkView.css";

export interface PermalinkViewProps {
  me: PropTypesOf<typeof ConversationThreadContainer>["me"] &
    PropTypesOf<typeof ReplyListContainer>["me"];
  asset: PropTypesOf<typeof ConversationThreadContainer>["asset"] &
    PropTypesOf<typeof ReplyListContainer>["asset"];
  comment:
    | PropTypesOf<typeof ConversationThreadContainer>["comment"] &
        PropTypesOf<typeof ReplyListContainer>["comment"]
    | null;
  showAllCommentsHref: string | null;
  onShowAllComments: (e: MouseEvent<any>) => void;
}

const PermalinkView: StatelessComponent<PermalinkViewProps> = ({
  showAllCommentsHref,
  comment,
  asset,
  onShowAllComments,
  me,
}) => {
  return (
    <div className={styles.root}>
      <Flex alignItems="center" justifyContent="center" direction="column">
        <Typography className={styles.title1}>
          You are currently viewing a
        </Typography>
        <Typography className={styles.title2}>SINGLE CONVERSATION</Typography>
        {showAllCommentsHref && (
          <Localized id="comments-permalinkView-viewFullDiscussion">
            <Button
              id="talk-comments-permalinkView-viewFullDiscussion"
              variant="underlined"
              color="primary"
              onClick={onShowAllComments}
              className={styles.button}
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
          />
          <div className={styles.replyList}>
            <ReplyListContainer me={me} comment={comment} asset={asset} />
          </div>
        </>
      )}
    </div>
  );
};

export default PermalinkView;
