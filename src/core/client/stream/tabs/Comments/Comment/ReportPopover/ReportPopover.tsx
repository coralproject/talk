import cn from "classnames";
import React from "react";

import CLASSES from "coral-stream/classes";
import { BaseButton, Icon } from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";

import ReportCommentFormContainer from "./ReportCommentFormContainer";
import styles from "./ReportPopover.css";

interface Props {
  comment: PropTypesOf<typeof ReportCommentFormContainer>["comment"];
  onClose: () => void;
  onResize: () => void;
}

class ReportPopover extends React.Component<Props> {
  public render() {
    const { onClose, onResize, comment } = this.props;
    return (
      <div className={cn(styles.root, CLASSES.reportPopover.$root)}>
        <BaseButton
          onClick={onClose}
          className={cn(styles.close, CLASSES.reportPopover.closeButton)}
          aria-label="Close Popover"
        >
          <Icon>close</Icon>
        </BaseButton>
        <ReportCommentFormContainer
          comment={comment}
          onClose={onClose}
          onResize={onResize}
        />
      </div>
    );
  }
}

export default ReportPopover;
