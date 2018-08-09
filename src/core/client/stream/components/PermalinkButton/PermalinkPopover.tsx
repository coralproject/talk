import { Localized } from "fluent-react/compat";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { Button, Flex, TextField } from "talk-ui/components";

import * as styles from "./PermalinkPopover.css";

interface InnerProps {
  permalinkURL: string;
  toggleVisibility: () => void;
}

interface State {
  copied: boolean;
}

class PermalinkPopover extends React.Component<InnerProps> {
  public state: State = {
    copied: false,
  };

  private onCopy = async () => {
    await this.toggleCopied();
    setTimeout(() => {
      this.toggleCopied();
    }, 800);
  };

  private toggleCopied = () => {
    this.setState((state: State) => ({
      copied: !state.copied,
    }));
  };

  public render() {
    const { permalinkURL } = this.props;
    const { copied } = this.state;
    return (
      <Flex itemGutter="half" className={styles.root}>
        <TextField
          defaultValue={permalinkURL}
          className={styles.textField}
          readOnly
        />
        <CopyToClipboard text={permalinkURL} onCopy={this.onCopy}>
          <Button color="primary" variant="filled" size="small">
            {copied ? (
              <Localized id="comments-permalinkPopover-copied">
                <span>Copied!</span>
              </Localized>
            ) : (
              <Localized id="comments-permalinkPopover-copy">
                <span>Copy</span>
              </Localized>
            )}
          </Button>
        </CopyToClipboard>
      </Flex>
    );
  }
}

export default PermalinkPopover;
