import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useLocal } from "coral-framework/lib/relay";
import { POST_COMMENT_FORM_ID } from "coral-stream/constants";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";
import { useShadowRootOrDocument } from "coral-ui/encapsulation";
import { getElementWindowTopOffset } from "coral-ui/helpers";

import { AddACommentButtonLocal } from "coral-stream/__generated__/AddACommentButtonLocal.graphql";

import styles from "./AddACommentButton.css";

interface Props {
  isQA?: boolean;
}

const AddACommentButton: FunctionComponent<Props> = ({ isQA = false }) => {
  const { renderWindow } = useCoralContext();
  const [, setLocal] = useLocal<AddACommentButtonLocal>(
    graphql`
      fragment AddACommentButtonLocal on Local {
        showLoadAllCommentsButton
      }
    `
  );
  const root = useShadowRootOrDocument();
  const onClick = useCallback(() => {
    if (!renderWindow) {
      return;
    }
    const postCommentForm = root.getElementById(POST_COMMENT_FORM_ID);
    if (postCommentForm) {
      setLocal({ showLoadAllCommentsButton: true });
      renderWindow.scrollTo({
        top: getElementWindowTopOffset(renderWindow, postCommentForm),
      });
    }
  }, [renderWindow, root, setLocal]);
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
          {isQA ? <span>Ask a Question</span> : <span>Add a Comment</span>}
        </Flex>
      </Button>
    </div>
  );
};

export default AddACommentButton;
