import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";

import { useViewerEvent } from "coral-framework/lib/events";
import { GQLSTORY_MODE } from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { POST_COMMENT_FORM_ID } from "coral-stream/constants";
import { CreateCommentFocusEvent } from "coral-stream/events";
import { HorizontalGutter } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import RTEContainer from "../../RTE";
import MessageBoxContainer from "../MessageBoxContainer";

import styles from "./PostCommentFormFake.css";

interface StorySettings {
  settings?: {
    mode?:
      | "COMMENTS"
      | "QA"
      | "RATINGS_AND_REVIEWS"
      | "%future added value"
      | null;
  };
}

interface Props {
  showMessageBox?: boolean;
  story: PropTypesOf<typeof MessageBoxContainer>["story"] & StorySettings;
  draft: string;
  onDraftChange: (draft: string) => void;
  onSignIn: () => void;
  rteConfig: PropTypesOf<typeof RTEContainer>["config"];
}

const PostCommentFormFake: FunctionComponent<Props> = ({
  showMessageBox,
  story,
  draft,
  onDraftChange,
  onSignIn,
  rteConfig,
}) => {
  const emitFocusEvent = useViewerEvent(CreateCommentFocusEvent);
  const onFocus = useCallback(() => {
    emitFocusEvent();
  }, [emitFocusEvent]);
  const onChange = useCallback(
    (html: string) => onDraftChange(html),
    [onDraftChange]
  );
  const isQA = story.settings && story.settings.mode === GQLSTORY_MODE.QA;
  return (
    <div id={POST_COMMENT_FORM_ID} className={CLASSES.createComment.$root}>
      {showMessageBox && (
        <MessageBoxContainer
          story={story}
          className={cn(CLASSES.createComment.message, styles.messageBox)}
        />
      )}
      <HorizontalGutter className={styles.root}>
        <div className={cn(styles.rteContainer, CLASSES.rte.fakeContainer)}>
          <Localized
            id={
              isQA
                ? "qa-postQuestionFormFake-rte"
                : "comments-postCommentFormFake-rte"
            }
            attrs={{ placeholder: true }}
          >
            <RTEContainer
              config={rteConfig}
              placeholder={isQA ? "Post a question" : "Post a comment"}
              value={draft}
              onChange={onChange}
              onFocus={onFocus}
            />
          </Localized>
        </div>
        <Localized id="comments-postCommentFormFake-signInAndJoin">
          <Button
            className={CLASSES.createComment.signIn}
            color="primary"
            variant="filled"
            type="submit"
            fullWidth
            onClick={onSignIn}
          >
            Sign in and join the conversation
          </Button>
        </Localized>
      </HorizontalGutter>
    </div>
  );
};

export default PostCommentFormFake;
