import { Localized } from "fluent-react/compat";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { Button } from "talk-ui/components";
import { PropTypesOf } from "talk-ui/types";

interface InnerProps extends PropTypesOf<typeof Button> {
  text: string;
}

interface State {
  copied: boolean;
}

class CopyButton extends React.Component<InnerProps> {
  private timeout: any = null;

  public state: State = {
    copied: false,
  };

  public componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  private handleCopy = () => {
    this.setCopied(true);
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setCopied(false);
    }, 500);
  };

  private setCopied = (b: boolean) => {
    this.setState({
      copied: b,
    });
  };

  public render() {
    const { text, ...rest } = this.props;
    const { copied } = this.state;
    return (
      <CopyToClipboard text={text} onCopy={this.handleCopy}>
        <Button color="primary" variant="filled" size="small" {...rest}>
          {copied ? (
            <Localized id="framework-copyButton-copied">
              <span>Copied!</span>
            </Localized>
          ) : (
            <Localized id="framework-copyButton-copy">
              <span>Copy</span>
            </Localized>
          )}
        </Button>
      </CopyToClipboard>
    );
  }
}

export default CopyButton;
