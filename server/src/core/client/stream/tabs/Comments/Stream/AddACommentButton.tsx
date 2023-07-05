import { Localized } from "@fluent/react/compat";
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
import { AddACommentButtonEvent } from "coral-stream/events";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";
import { useShadowRootOrDocument } from "coral-ui/encapsulation";

import { AddACommentButtonLocal } from "coral-stream/__generated__/AddACommentButtonLocal.graphql";

import styles from "./AddACommentButton.css";

const getCommentField = (commentForm: HTMLElement) => {
  const iFrame = commentForm.querySelector("iframe");
  if (iFrame === null) {
    return null;
  }
  return (iFrame as any).contentWindow.document.body.querySelector(
    "#comments-postCommentForm-field"
  ) as HTMLInputElement;
};

interface Props {
  currentScrollRef: any;
  isQA?: boolean;
}
const AddACommentButton: FunctionComponent<Props> = ({
  isQA = false,
  currentScrollRef,
}) => {
  const pollForCommentFormElement = useCallback(
    async () =>
      new Promise<HTMLElement>((resolve, reject) => {
        let count = 0;
        const commentFormPolling = setInterval(async () => {
          count += 1;
          const postCommentFormElement =
            root.getElementById(POST_COMMENT_FORM_ID);
          if (
            postCommentFormElement !== undefined &&
            postCommentFormElement !== null
          ) {
            clearInterval(commentFormPolling);
            resolve(postCommentFormElement);
          }
          if (count > 10) {
            clearInterval(commentFormPolling);
            reject("Unable to locate comment form");
          }
        }, 100);
      }),
    []
  );

  const { renderWindow, eventEmitter } = useCoralContext();
  const [{ commentsFullyLoaded, commentsTab }, setLocal] =
    useLocal<AddACommentButtonLocal>(
      graphql`
        fragment AddACommentButtonLocal on Local {
          loadAllButtonHasBeenClicked
          commentsFullyLoaded
          commentsTab
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
        done: async () => {
          const postCommentFormElement = await pollForCommentFormElement();
          postCommentFormElement.scrollIntoView();
        },
      });
    }
  }, [currentScrollRef, root]);

  useEffect(() => {
    if (commentsFullyLoaded && scrollIntoViewAfterLoad) {
      scrollToLastCommentAndPostCommentForm();
      setScrollIntoViewAfterLoad(false);
    }
  }, [
    scrollIntoViewAfterLoad,
    commentsFullyLoaded,
    setScrollIntoViewAfterLoad,
    scrollToLastCommentAndPostCommentForm,
  ]);

  const onClick = useCallback(async () => {
    AddACommentButtonEvent.emit(eventEmitter);

    if (!renderWindow) {
      return;
    }

    if (commentsTab === "FEATURED_COMMENTS") {
      const postCommentForm = root.getElementById(POST_COMMENT_FORM_ID);
      if (postCommentForm) {
        postCommentForm.scrollIntoView();
      }
    }

    if (commentsTab === "ALL_COMMENTS") {
      setLocal({ loadAllButtonHasBeenClicked: true });
      if (!commentsFullyLoaded) {
        const loadAllButton = root.querySelector("#comments-loadAll");
        if (loadAllButton) {
          const offset =
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            loadAllButton.getBoundingClientRect().top +
            renderWindow.pageYOffset -
            150;
          renderWindow.scrollTo({ top: offset });
        }
        setScrollIntoViewAfterLoad(true);
      } else {
        scrollToLastCommentAndPostCommentForm();
      }
    }

    const commentForm = await pollForCommentFormElement();
    const field = getCommentField(commentForm);
    if (field !== null) {
      field.focus();
    }
  }, [
    renderWindow,
    root,
    setLocal,
    scrollToLastCommentAndPostCommentForm,
    commentsFullyLoaded,
    setScrollIntoViewAfterLoad,
    eventEmitter,
    commentsTab,
    pollForCommentFormElement,
  ]);

  return (
    <div className={styles.root}>
      <Localized id="addACommentButton" attrs={{ "aria-label": true }}>
        <Button
          variant="outlined"
          color="primary"
          paddingSize="small"
          upperCase
          className={styles.button}
          onClick={onClick}
          aria-label="Add a comment. This button will move focus to the bottom of the comments."
        >
          <Flex alignItems="center">
            <Icon className={styles.icon}>create</Icon>
            {isQA ? <span>Ask a Question</span> : <span>Add a Comment</span>}
          </Flex>
        </Button>
      </Localized>
    </div>
  );
};
export default AddACommentButton;
