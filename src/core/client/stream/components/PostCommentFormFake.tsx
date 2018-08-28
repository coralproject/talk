import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Button, HorizontalGutter } from "talk-ui/components";
import * as styles from "./PostCommentFormFake.css";

const PostCommentFormFake: StatelessComponent = props => (
  <HorizontalGutter className={styles.root}>
    <textarea
      className={styles.textarea}
      placeholder="Post a comment"
      disabled
    />
    <Localized id="comments-PostCommentFormFake-signInAndJoin">
      <Button color="primary" variant="filled" disabled type="submit" fullWidth>
        Sign in and join the conversation
      </Button>
    </Localized>
  </HorizontalGutter>
);

export default PostCommentFormFake;
