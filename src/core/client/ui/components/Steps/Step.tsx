import React, { Component, ReactText } from "react";
import Flex from "../Flex";
import Typography from "../Typography";
import Circle from "./Circle";

interface StepProps {
  children: ReactText;
  active?: boolean;
  completed?: boolean;
}

class Step extends Component<StepProps> {
  public render() {
    const { children, completed, active } = this.props;
    return (
      <Flex direction="column" justifyContent="center" alignItems="center">
        <Circle completed={completed} active={active} />
        <Typography>{children}</Typography>
      </Flex>
    );
  }
}

export default Step;
