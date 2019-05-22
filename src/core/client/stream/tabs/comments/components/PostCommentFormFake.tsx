import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { PropTypesOf } from "coral-framework/types";
import { Button, HorizontalGutter } from "coral-ui/components";

import MessageBoxContainer from "../containers/MessageBoxContainer";
import RTE from "./RTE";

import styles from "./PostCommentFormFake.css";

interface Props {
  showMessageBox?: boolean;
  story: PropTypesOf<typeof MessageBoxContainer>["story"];
  draft: string;
  onDraftChange: (draft: string) => void;
  onSignIn: () => void;
}

const PostCommentFormFake: FunctionComponent<Props> = props => {
  const onChange = useCallback(
    (data: { html: string; text: string }) => props.onDraftChange(data.html),
    [props.onDraftChange]
  );
  return (
    <div>
      {props.showMessageBox && (
        <MessageBoxContainer
          story={props.story}
          className={styles.messageBox}
        />
      )}
      <HorizontalGutter className={styles.root}>
        <div aria-hidden="true">
          <Localized
            id="comments-postCommentFormFake-rte"
            attrs={{ placeholder: true }}
          >
            <RTE
              placeholder="Post a comment"
              value={props.draft}
              onChange={onChange}
            />
          </Localized>
        </div>
        <Localized id="comments-postCommentFormFake-signInAndJoin">
          <Button
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
