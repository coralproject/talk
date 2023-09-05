import cn from "classnames";
import React, { Component, ReactNode } from "react";

import Flex from "../Flex";

import styles from "./StepBar.css";

interface StepBarProps {
  children: ReactNode;
  currentStep: number;
  className?: string;
}

class StepBar extends Component<StepBarProps> {
  public render() {
    const { children, currentStep } = this.props;
    const steps = React.Children.toArray(children);
    const stepsToRender = steps
      .filter((child: React.ReactElement<any>) => !child.props.hidden)
      .map((child: React.ReactElement<any>, index: number, arr) =>
        React.cloneElement(child, {
          last: arr.length - 1 === index,
          active: currentStep === index,
          completed: currentStep > index,
        })
      );

    return (
      <div className={cn(styles.root, this.props.className)}>
        <Flex
          direction="row"
          itemGutter
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
