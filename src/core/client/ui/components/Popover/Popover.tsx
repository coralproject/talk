import React from "react";
import Attachment from "../Attachment";
import * as styles from "./Popover.css";

interface InnerProps {
  body: React.ReactElement<any> | null;
  children: React.ReactElement<any>;
}

class Popover extends React.Component<InnerProps> {
  public render() {
    const { body, children: reference } = this.props;
    return (
      <Attachment body={body} className={styles.root}>
        {reference}
      </Attachment>
    );
  }
}

export default Popover;
