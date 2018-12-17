import React, { Component, ReactNode, ReactText } from "react";
import Flex from "../Flex";
import Typography from "../Typography";
import Circle from "./Circle";
import Line from "./Line";

import styles from "./Step.css";

interface StepProps {
  children: ReactText | ReactNode;
  active?: boolean;
  completed?: boolean;
  last?: boolean;
  hidden?: boolean;
}

class Step extends Component<StepProps> {
  public render() {
    const { children, completed, active, last, hidden } = this.props;
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
          {!last && <Line completed={completed} />}
        </Flex>
        <Typography className={styles.text}>{children}</Typography>
      </div>
    );
  }
}

export default Step;
