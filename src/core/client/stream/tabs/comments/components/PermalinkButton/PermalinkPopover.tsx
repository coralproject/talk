import React from "react";

import { CopyButton } from "talk-framework/components";
import { Flex, TextField } from "talk-ui/components";

import styles from "./PermalinkPopover.css";

interface InnerProps {
  permalinkURL: string;
}

class PermalinkPopover extends React.Component<InnerProps> {
  public render() {
    const { permalinkURL } = this.props;
    return (
      <Flex itemGutter="half" className={styles.root}>
        <TextField
          defaultValue={permalinkURL}
          className={styles.textField}
          readOnly
        />
        <CopyButton text={permalinkURL} />
      </Flex>
    );
  }
}

export default PermalinkPopover;
