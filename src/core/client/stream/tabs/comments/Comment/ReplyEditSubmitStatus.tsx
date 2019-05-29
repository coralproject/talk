import { Localized } from "fluent-react/compat";
import React from "react";

import { Button, CallOut, Flex, HorizontalGutter } from "coral-ui/components";

import { SubmitStatus } from "../helpers/getSubmitStatus";

import styles from "./ReplyEditSubmitStatus.css";

interface Props {
  status: SubmitStatus;
  onDismiss: () => void;
}

function getMessage(status: SubmitStatus) {
  switch (status) {
    case "RETRY":
      throw new Error(`Invalid status ${status}`);
    case "REJECTED":
    // TODO: Show a different message when rejected?
    case "IN_REVIEW":
      return (
        <Localized id="comments-submitStatus-submittedAndWillBeReviewed">
          <CallOut className={styles.callout} color="primary" fullWidth>
            Your comment has been submitted and will be reviewed by a moderator
          </CallOut>
        </Localized>
      );
    case "APPROVED":
    case null:
      return null;
    default:
      throw new Error(`Unknown status ${status}`);
  }
}

export default function ReplyEditSubmitStatus(props: Props) {
  return (
    <HorizontalGutter>
      {getMessage(props.status)}
      <Flex justifyContent="flex-end">
        <Localized id="comments-submitStatus-dismiss">
          <Button onClick={props.onDismiss} variant="outlined">
            Dismiss
          </Button>
        </Localized>
      </Flex>
    </HorizontalGutter>
  );
}
