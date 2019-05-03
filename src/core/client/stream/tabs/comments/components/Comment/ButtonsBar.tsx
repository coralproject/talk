import React, { FunctionComponent } from "react";

import { Flex } from "talk-ui/components";

const ButtonsBar: FunctionComponent = props => {
  return (
    <Flex direction="row" itemGutter="half">
      {props.children}
    </Flex>
  );
};

export default ButtonsBar;
