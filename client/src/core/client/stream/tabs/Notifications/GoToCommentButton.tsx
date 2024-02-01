import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { getURLWithCommentID } from "coral-framework/helpers";
import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./GoToCommentButton.css";

interface Props {
  commentID: string;
  commentStoryURL: string;
}

const GoToCommentButton: FunctionComponent<Props> = ({
  commentID,
  commentStoryURL,
}) => {
  const permalinkURL = getURLWithCommentID(commentStoryURL, commentID);
  return (
    <Flex marginTop={1} marginBottom={2}>
      <Localized
        id="notifications-goToCommentButton"
        elems={{
          button: (
            <Button
              className={styles.goToReplyButton}
              variant="none"
              href={permalinkURL}
              target="_blank"
            >
              Go to this comment{" "}
            </Button>
          ),
          readInContext: (
            <div className={styles.readInContext}>
              to read in context or reply
            </div>
          ),
        }}
      >
        <>
          <Button
            className={styles.goToReplyButton}
            variant="none"
            href={permalinkURL}
            target="_blank"
          >
            Go to this comment{" "}
          </Button>
          <div className={styles.readInContext}>
            to read in context or reply
          </div>
        </>
      </Localized>
    </Flex>
  );
};

export default GoToCommentButton;
