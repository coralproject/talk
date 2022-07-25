import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useLocal } from "coral-framework/lib/relay";
import { POST_COMMENT_FORM_ID } from "coral-stream/constants";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";
import { useShadowRootOrDocument } from "coral-ui/encapsulation";

import { AddACommentButtonLocal } from "coral-stream/__generated__/AddACommentButtonLocal.graphql";

import styles from "./AddACommentButton.css";

interface Props {
  currentScrollRef: any;
  isQA?: boolean;
}
const AddACommentButton: FunctionComponent<Props> = ({
  isQA = false,
  currentScrollRef,
}) => {
  const { renderWindow } = useCoralContext();
  const [, setLocal] = useLocal<AddACommentButtonLocal>(
    graphql`
      fragment AddACommentButtonLocal on Local {
        addACommentButtonClicked
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
      // Make sure that the Load all comments button is displayed even if it
      // was previously clicked and no longer displayed.
      // Then scroll to last comment, which is right above the Add a comment box,
      // and scroll the post comment form into view.
      setLocal({ addACommentButtonClicked: true });
      if (currentScrollRef.current) {
        currentScrollRef.current.scrollToIndex({
          align: "center",
          index: "LAST",
          behavior: "auto",
          done: () => {
            let count = 0;
            const stopExists = setInterval(async () => {
              count += 1;
              const postCommentFormElement = root.getElementById(
                POST_COMMENT_FORM_ID
              );
              if (
                postCommentFormElement !== undefined &&
                postCommentFormElement !== null
              ) {
                clearInterval(stopExists);
                postCommentForm.scrollIntoView();
              }
              if (count > 10) {
                clearInterval(stopExists);
              }
            }, 100);
          },
        });
        // }
      }
    }
  }, [renderWindow, root, setLocal, currentScrollRef]);

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
