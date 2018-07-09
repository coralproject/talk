import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Button, Input, Popover } from "talk-ui/components";

class PermalinkPopover extends React.Component {
  public render() {
    const props = this.props;
    return (
      <Popover
        body={
          <div>
            <Input defaultValue={props.id} className={styles.input} />
            <CopyToClipboard text={props.id}>
              <Button primary>Copy</Button>
            </CopyToClipboard>
          </div>
        }
      >
        <button>Reference element</button>
      </Popover>
    );
  }
}

export default PermalinkPopover;
