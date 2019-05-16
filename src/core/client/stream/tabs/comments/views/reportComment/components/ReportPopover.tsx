import React from "react";

import { BaseButton, Icon } from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";

import ReportCommentFormContainer from "../containers/ReportCommentFormContainer";
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
      <div className={styles.root}>
        <BaseButton
          onClick={onClose}
          className={styles.close}
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
