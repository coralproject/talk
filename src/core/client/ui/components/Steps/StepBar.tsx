import React, { Component, ReactNode } from "react";
import Flex from "../Flex";
import * as styles from "./StepBar.css";

interface StepBarProps {
  children: ReactNode;
}

class StepBar extends Component<StepBarProps> {
  public render() {
    const { children } = this.props;
    return (
      <div className={styles.root}>
        <Flex
          direction="row"
          itemGutter="double"
          alignItems="center"
          justifyContent="center"
        >
          <span className={styles.line} />
          {children}
        </Flex>
      </div>
    );
  }
}

export default StepBar;
