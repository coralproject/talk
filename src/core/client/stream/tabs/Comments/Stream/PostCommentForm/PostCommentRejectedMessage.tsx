import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { AlertCircleIcon, SvgIcon } from "coral-ui/components/icons";
import { CallOut } from "coral-ui/components/v3";

export interface PostCommentRejectedProps {
  onDismiss: () => void;
}

const PostCommentRejected: FunctionComponent<PostCommentRejectedProps> = (
  props
) => {
  return (
    <CallOut
      className={CLASSES.createComment.rejected}
      color="error"
      titleWeight="semiBold"
      icon={<SvgIcon size="sm" Icon={AlertCircleIcon} />}
      title={
        <Localized id="comments-submitStatus-submittedAndRejected">
          <div>This comment has been rejected for violating our guidelines</div>
        </Localized>
      }
      onClose={props.onDismiss}
      role="alert"
    />
  );
};

export default PostCommentRejected;
