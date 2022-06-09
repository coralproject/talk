import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useLocal } from "coral-framework/lib/relay";
import { NUM_INITIAL_COMMENTS } from "coral-stream/constants";
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
  const [{ totalCommentsLength }, setLocal] = useLocal<AddACommentButtonLocal>(
    graphql`
      fragment AddACommentButtonLocal on Local {
        addACommentButtonClicked
        totalCommentsLength
        zKeyClickedLoadAll
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
      setLocal({ zKeyClickedLoadAll: false });
      if (totalCommentsLength) {
        const indexToScroll =
          totalCommentsLength < NUM_INITIAL_COMMENTS
            ? totalCommentsLength - 1
            : NUM_INITIAL_COMMENTS - 1;
        if (currentScrollRef.current) {
          currentScrollRef.current.scrollIntoView({
            align: "center",
            index: indexToScroll,
            behavior: "auto",
            done: () => {
              setTimeout(() => {
                postCommentForm.scrollIntoView();
              }, 0);
            },
          });
        }
      }
    }
  }, [renderWindow, root, setLocal, currentScrollRef, totalCommentsLength]);

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
