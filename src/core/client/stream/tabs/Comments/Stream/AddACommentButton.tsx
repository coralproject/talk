import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
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
  const [{ commentsFullyLoaded }, setLocal] = useLocal<AddACommentButtonLocal>(
    graphql`
      fragment AddACommentButtonLocal on Local {
        loadAllButtonHasBeenClicked
        commentsFullyLoaded
      }
    `
  );
  const root = useShadowRootOrDocument();

  const [scrollIntoViewAfterLoad, setScrollIntoViewAfterLoad] = useState(false);

  const scrollToLastCommentAndPostCommentForm = useCallback(() => {
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
              postCommentFormElement.scrollIntoView();
            }
            if (count > 10) {
              clearInterval(stopExists);
            }
          }, 100);
        },
      });
    }
  }, [currentScrollRef, root]);

  useEffect(() => {
    if (commentsFullyLoaded && scrollIntoViewAfterLoad) {
      scrollToLastCommentAndPostCommentForm();
    }
  }, [scrollIntoViewAfterLoad, commentsFullyLoaded]);

  const onClick = useCallback(() => {
    if (!renderWindow) {
      return;
    }
    setLocal({ loadAllButtonHasBeenClicked: true });
    if (!commentsFullyLoaded) {
      scrollToLastCommentAndPostCommentForm();
      setScrollIntoViewAfterLoad(true);
    } else {
      scrollToLastCommentAndPostCommentForm();
    }
  }, [
    renderWindow,
    root,
    setLocal,
    scrollToLastCommentAndPostCommentForm,
    commentsFullyLoaded,
    setScrollIntoViewAfterLoad,
  ]);

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
