import { Localized as L } from "fluent-react/compat";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Button, Popover, TextField } from "talk-ui/components";
import * as styles from "./PermalinkPopover.css";

interface InnerProps {
  commentId: string;
}

interface State {
  copied: boolean;
  showBody: boolean;
}

class PermalinkPopover extends React.Component<InnerProps> {
  public state: State = {
    copied: false,
    showBody: false,
  };

  public onCopy = async () => {
    await this.toggleCopied();
    setTimeout(() => {
      this.toggleCopied();
    }, 800);
  };

  public onClick = () => this.toggleShow();

  public toggleShow = () => {
    this.setState((state: State) => ({
      showBody: !state.showBody,
    }));
  };

  public toggleCopied = () => {
    this.setState((state: State) => ({
      copied: !state.copied,
    }));
  };

  public render() {
    const { commentId } = this.props;
    const { copied, showBody } = this.state;
    return (
      <Popover
        body={
          showBody ? (
            <div className={styles.root}>
              <TextField
                defaultValue={commentId}
                className={styles.textField}
              />
              <CopyToClipboard text={commentId} onCopy={this.onCopy}>
                <Button primary>
                  {copied ? (
                    <L id="comments-permalink-copied">
                      <span>Copied!</span>
                    </L>
                  ) : (
                    <L id="comments-permalink-copy">
                      <span>Copy</span>
                    </L>
                  )}
                </Button>
              </CopyToClipboard>
            </div>
          ) : null
        }
      >
        <button className={styles.shareButton} onClick={this.onClick}>
          <L id="comments-permalink-share">
            <span>Share</span>
          </L>
        </button>
      </Popover>
    );
  }
}

export default PermalinkPopover;
