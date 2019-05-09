import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { Button, HorizontalGutter } from "talk-ui/components";

import MessageBoxContainer from "../containers/MessageBoxContainer";
import RTE from "./RTE";

import styles from "./PostCommentFormFake.css";

interface Props {
  showMessageBox?: boolean;
  story: PropTypesOf<typeof MessageBoxContainer>["story"];
}

const PostCommentFormFake: FunctionComponent<Props> = props => (
  <div>
    {props.showMessageBox && (
      <MessageBoxContainer story={props.story} className={styles.messageBox} />
    )}
    <HorizontalGutter className={styles.root}>
      <div aria-hidden="true">
        <Localized
          id="comments-postCommentFormFake-rte"
          attrs={{ placeholder: true }}
        >
          <RTE placeholder="Post a comment" disabled />
        </Localized>
      </div>
      <Localized id="comments-postCommentFormFake-signInAndJoin">
        <Button
          color="primary"
          variant="filled"
          disabled
          type="submit"
          fullWidth
        >
          Sign in and join the conversation
        </Button>
      </Localized>
    </HorizontalGutter>
  </div>
);

export default PostCommentFormFake;
