import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React from "react";

import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import { SubmitStatus } from "../helpers/getSubmitStatus";

interface Props {
  status: SubmitStatus;
  buttonClassName?: string;
  inReviewClassName?: string;
  onDismiss: () => void;
}

function getMessage(
  status: SubmitStatus,
  inReviewClassName = "",
  onDismiss: () => void
) {
  switch (status) {
    case "RETRY":
      throw new Error(`Invalid status ${status}`);
    case "REJECTED":
      return (
        <CallOut
          className={cn(inReviewClassName)}
          color="error"
          icon={<Icon size="sm">error</Icon>}
          onClose={onDismiss}
          titleWeight="semiBold"
          title={
            <Localized id="comments-submitStatus-submittedAndRejected">
              <span>
                This comment has been rejected for violating our guidelines
              </span>
            </Localized>
          }
          role="alert"
        />
      );
    case "IN_REVIEW":
      return (
        <CallOut
          className={cn(inReviewClassName)}
          color="primary"
          icon={<Icon size="sm">check</Icon>}
          onClose={onDismiss}
          titleWeight="semiBold"
          title={
            <Localized id="comments-submitStatus-submittedAndWillBeReviewed">
              <span>
                Your comment has been submitted and will be reviewed by a
                moderator
              </span>
            </Localized>
          }
          aria-live="polite"
        />
      );
    case "APPROVED":
    case null:
      return null;
    default:
      throw new Error(`Unknown status ${status}`);
  }
}

export default function ReplyEditSubmitStatus(props: Props) {
  return getMessage(props.status, props.inReviewClassName, props.onDismiss);
}
