import React, { Component, ReactNode, ReactText } from "react";

import Flex from "coral-ui/components/v2/Flex";

import Circle from "./Circle";
import Line from "./Line";

import styles from "./Step.css";

interface StepProps {
  children?: ReactText | ReactNode;
  active?: boolean;
  completed?: boolean;
  last?: boolean;
  hidden?: boolean;
  classes?: {
    line?: string;
  };
}

class Step extends Component<StepProps> {
  public render() {
    const { children, completed, active, last, hidden, classes } = this.props;
    if (hidden) {
      return null;
    }
    return (
      <div className={styles.root}>
        <Flex
          direction="row"
          justifyContent="center"
          alignItems="center"
          itemGutter
        >
          <Circle completed={completed} active={active} />
          {!last && (
            <Line
              completed={completed}
              className={classes ? classes.line : undefined}
            />
          )}
        </Flex>
        <div className={styles.text}>{children}</div>
      </div>
    );
  }
}

export default Step;
