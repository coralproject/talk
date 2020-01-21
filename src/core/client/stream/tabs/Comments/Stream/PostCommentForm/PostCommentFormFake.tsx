import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";

import { useViewerEvent } from "coral-framework/lib/events";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { CreateCommentFocusEvent } from "coral-stream/events";
import { Button, HorizontalGutter } from "coral-ui/components";

import RTE from "../../RTE";
import MessageBoxContainer from "../MessageBoxContainer";

import styles from "./PostCommentFormFake.css";

interface Props {
  showMessageBox?: boolean;
  story: PropTypesOf<typeof MessageBoxContainer>["story"];
  draft: string;
  onDraftChange: (draft: string) => void;
  onSignIn: () => void;
}

const PostCommentFormFake: FunctionComponent<Props> = props => {
  const emitFocusEvent = useViewerEvent(CreateCommentFocusEvent);
  const onFocus = useCallback(() => {
    emitFocusEvent();
  }, [emitFocusEvent]);
  const onChange = useCallback(
    (data: { html: string; text: string }) => props.onDraftChange(data.html),
    [props.onDraftChange]
  );
  return (
    <div className={CLASSES.createComment.$root}>
      {props.showMessageBox && (
        <MessageBoxContainer
          story={props.story}
          className={cn(CLASSES.createComment.message, styles.messageBox)}
        />
      )}
      <HorizontalGutter className={styles.root}>
        <div>
          <Localized
            id="comments-postCommentFormFake-rte"
            attrs={{ placeholder: true }}
          >
            <RTE
              placeholder="Post a comment"
              value={props.draft}
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
            onClick={props.onSignIn}
          >
            Sign in and join the conversation
          </Button>
        </Localized>
      </HorizontalGutter>
    </div>
  );
};

export default PostCommentFormFake;
