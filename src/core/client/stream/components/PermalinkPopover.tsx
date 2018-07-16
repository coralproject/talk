import { Localized } from "fluent-react/compat";
import React, { CSSProperties } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { RefHandler } from "react-popper";
import { Button, TextField } from "talk-ui/components";
import * as styles from "./PermalinkPopover.css";

interface InnerProps {
  commentId: string;
  style?: CSSProperties;
  innerRef?: RefHandler;
}

interface State {
  copied: boolean;
}

class PermalinkPopover extends React.Component<InnerProps> {
  public state: State = {
    copied: false,
  };

  public onCopy = async () => {
    await this.toggleCopied();
    setTimeout(() => {
      this.toggleCopied();
    }, 800);
  };

  public toggleCopied = () => {
    this.setState((state: State) => ({
      copied: !state.copied,
    }));
  };

  public render() {
    const { commentId, style, innerRef } = this.props;
    const { copied } = this.state;
    return (
      <div className={styles.root} style={style} ref={innerRef}>
        <TextField defaultValue={commentId} className={styles.textField} />
        <CopyToClipboard text={commentId} onCopy={this.onCopy}>
          <Button primary>
            {copied ? (
              <Localized id="comments-permalink-copied">
                <span>Copied!</span>
              </Localized>
            ) : (
              <Localized id="comments-permalink-copy">
                <span>Copy</span>
              </Localized>
            )}
          </Button>
        </CopyToClipboard>
      </div>
    );
  }
}

export default PermalinkPopover;
