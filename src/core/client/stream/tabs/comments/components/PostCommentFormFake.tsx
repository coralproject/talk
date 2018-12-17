import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Button, HorizontalGutter } from "talk-ui/components";

import RTE from "./RTE";

import styles from "./PostCommentFormFake.css";

const PostCommentFormFake: StatelessComponent = props => (
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
      <Button color="primary" variant="filled" disabled type="submit" fullWidth>
        Sign in and join the conversation
      </Button>
    </Localized>
  </HorizontalGutter>
);

export default PostCommentFormFake;
