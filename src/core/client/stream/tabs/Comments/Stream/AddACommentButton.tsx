import React, { FunctionComponent, useCallback } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { POST_COMMENT_FORM_ID } from "coral-stream/constants";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./AddACommentButton.css";

const AddACommentButton: FunctionComponent = () => {
  const { pym } = useCoralContext();
  const onClick = useCallback(() => {
    if (!pym) {
      return;
    }

    pym.scrollParentToChildEl(POST_COMMENT_FORM_ID);
  }, [pym]);

  return (
    <div className={styles.root}>
      <Button
        variant="outlined"
        color="primary"
        paddingSize="small"
        upperCase
        className={styles.button}
        onClick={onClick}
      >
        <Flex alignItems="center">
          <Icon className={styles.icon}>create</Icon>
          <span>Add a Comment</span>
        </Flex>
      </Button>
    </div>
  );
};

export default AddACommentButton;
