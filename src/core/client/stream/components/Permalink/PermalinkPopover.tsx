import { Localized } from "fluent-react/compat";
import React, { CSSProperties } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Button, ClickOutside, Flex, TextField } from "talk-ui/components";

interface InnerProps {
  permalinkUrl: string;
  style?: CSSProperties;
  toggleVisibility: () => void;
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
    const { permalinkUrl, toggleVisibility } = this.props;
    const { copied } = this.state;
    return (
      <ClickOutside onClickOutside={toggleVisibility}>
        <Flex itemGutter="half">
          <TextField defaultValue={permalinkUrl} />
          <CopyToClipboard text={permalinkUrl} onCopy={this.onCopy}>
            <Button color="primary" variant="filled">
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
        </Flex>
      </ClickOutside>
    );
  }
}

export default PermalinkPopover;
