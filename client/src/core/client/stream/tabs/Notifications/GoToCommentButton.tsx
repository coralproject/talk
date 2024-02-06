import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { getURLWithCommentID } from "coral-framework/helpers";
import {
  ButtonSvgIcon,
  ShareExternalLinkIcon,
} from "coral-ui/components/icons";
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
          icon: <ButtonSvgIcon Icon={ShareExternalLinkIcon} />,
        }}
      >
        <Button
          className={styles.goToReplyButton}
          variant="none"
          href={permalinkURL}
          target="_blank"
        >
          Go to this comment <ButtonSvgIcon Icon={ShareExternalLinkIcon} />
        </Button>
      </Localized>
    </Flex>
  );
};

export default GoToCommentButton;
