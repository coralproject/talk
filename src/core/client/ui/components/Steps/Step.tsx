import React, { Component, ReactText } from "react";
import Flex from "../Flex";
import Typography from "../Typography";
import Circle from "./Circle";
import Line from "./Line";
import * as styles from "./Step.css";

interface StepProps {
  children: ReactText;
  active?: boolean;
  completed?: boolean;
  isLast?: boolean;
}

class Step extends Component<StepProps> {
  public render() {
    const { children, completed, active, isLast } = this.props;
    return (
      <div className={styles.root}>
        <Flex
          direction="row"
          justifyContent="center"
          alignItems="center"
          itemGutter
        >
          <Circle completed={completed} active={active} />
          {!isLast && <Line completed={completed} />}
        </Flex>
        <Typography className={styles.text}>{children}</Typography>
      </div>
    );
  }
}

export default Step;
