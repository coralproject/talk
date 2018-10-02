import React, { Component, ReactNode } from "react";
import Flex from "../Flex";
import * as styles from "./StepBar.css";

interface StepBarProps {
  children: ReactNode;
}

class StepBar extends Component<StepBarProps> {
  public render() {
    const { children } = this.props;
    const steps = React.Children.toArray(children);
    const stepCount = steps.length;
    const stepsToRender = steps.map(
      (child: React.ReactElement<any>, index: number) =>
        React.cloneElement(child, {
          isLast: stepCount - 1 === index,
        })
    );

    return (
      <div className={styles.root}>
        <Flex
          direction="row"
          itemGutter="double"
          alignItems="center"
          justifyContent="center"
        >
          {stepsToRender}
        </Flex>
      </div>
    );
  }
}

export default StepBar;
