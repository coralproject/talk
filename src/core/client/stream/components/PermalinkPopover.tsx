import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Button, Popover, TextField } from "talk-ui/components";
import * as styles from "./PermalinkPopover.css";

interface InnerProps {
  commentId: string;
}

class PermalinkPopover extends React.Component<InnerProps> {
  public render() {
    const { commentId } = this.props;
    return (
      <Popover
        body={
          <div className={styles.root}>
            <TextField defaultValue={commentId} className={styles.textField} />
            <CopyToClipboard text={commentId}>
              <Button primary>Copy</Button>
            </CopyToClipboard>
          </div>
        }
      >
        <button className={styles.shareButton}>Share</button>
      </Popover>
    );
  }
}

export default PermalinkPopover;
