import React, { FunctionComponent, useCallback } from "react";

import { POST_COMMENT_FORM_ID } from "coral-stream/constants";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./AddACommentButton.css";

const AddACommentButton: FunctionComponent = () => {
  const onClick = useCallback(() => {
    const element = document.getElementById(POST_COMMENT_FORM_ID);
    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: "smooth" });
  }, []);

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
