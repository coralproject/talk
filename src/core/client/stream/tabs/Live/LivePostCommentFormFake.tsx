import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";

import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { POST_COMMENT_FORM_ID } from "coral-stream/constants";
import { HorizontalGutter } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import RTEContainer from "../Comments/RTE";

import styles from "./LivePostCommentFormFake.css";

interface Props {
  draft: string;
  onDraftChange: (draft: string) => void;
  onSignIn: () => void;
  onFocus: () => void;
  rteConfig: PropTypesOf<typeof RTEContainer>["config"];
}

const PostCommentFormFake: FunctionComponent<Props> = ({
  draft,
  onDraftChange,
  onSignIn,
  rteConfig,
  onFocus,
}) => {
  const [focus, setFocus] = useState(false);
  const handleFocus = useCallback(() => {
    setFocus(true);
    if (onFocus) {
      onFocus();
    }
  }, [onFocus]);
  const handleBlur = useCallback(() => {
    setFocus(false);
  }, []);
  const handleChange = useCallback((html: string) => onDraftChange(html), [
    onDraftChange,
  ]);
  return (
    <div id={POST_COMMENT_FORM_ID} className={CLASSES.createComment.$root}>
      <HorizontalGutter className={styles.root}>
        <div className={cn(styles.rteContainer, { [styles.focus]: focus })}>
          <Localized
            id={"comments-postCommentFormFake-rte"}
            attrs={{ placeholder: true }}
          >
            <RTEContainer
              config={rteConfig}
              placeholder={"Write a message..."}
              value={draft}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              contentClassName={styles.content}
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
